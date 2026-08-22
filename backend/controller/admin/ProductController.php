<?php
require_once __DIR__ . '/../../repository/ProductRepository.php';
require_once __DIR__ . '/../../repository/StockRepository.php';

class ProductController {
    private ProductRepository $productRepo;
    private StockRepository   $stockRepo;

    // Allowed image MIME types and their extensions
    private const ALLOWED_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];
    private const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
    private const UPLOAD_DIR     = __DIR__ . '/../../uploads/products/';

    public function __construct() {
        $this->productRepo = new ProductRepository();
        $this->stockRepo   = new StockRepository();
    }

    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        try {
            if ($action === 'categories') {
                match ($method) {
                    'GET'    => sendSuccess($this->productRepo->getAllCategories()),
                    'POST'   => $this->createCategory(),
                    'PUT'    => $this->updateCategory(),
                    'DELETE' => $this->deleteCategory(),
                    default  => sendError('Method not allowed', 405)
                };
                return;
            }
            if ($action === 'pricing') {
                if ($method === 'POST') $this->setPrice();
                else sendError('Method not allowed', 405);
                return;
            }
            match ($method) {
                'GET'    => $this->getProducts(),
                'POST'   => isset($_GET['id']) ? $this->updateProduct() : $this->createProduct(),
                'PUT'    => $this->updateProduct(),
                'DELETE' => $this->deleteProduct(),
                default  => sendError('Method not allowed', 405)
            };
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    // ─── GET ─────────────────────────────────────────────────────────────────

    private function getProducts(): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id) {
            $p = $this->productRepo->findById($id);
            if (!$p) sendError('Product not found', 404);
            sendSuccess($p);
        }
        sendSuccess($this->productRepo->getAll());
    }

    // ─── POST (Create) ────────────────────────────────────────────────────────

    private function createProduct(): void {
        // Supports both multipart/form-data (with image) and JSON (without image)
        $isMultipart = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
        $body = $isMultipart ? $_POST : getBody();

        if (empty($body['product_name']) || empty($body['category_id'])) {
            sendError('product_name and category_id required', 400);
        }

        $data = [
            'category_id'  => (int)$body['category_id'],
            'product_name' => trim($body['product_name']),
            'description'  => trim($body['description'] ?? '') ?: null,
            'unit'         => trim($body['unit']        ?? '') ?: null,
            'image_url'    => null,
        ];

        // Handle optional image upload
        if (!empty($_FILES['image']['tmp_name'])) {
            $data['image_url'] = $this->saveImage($_FILES['image']);
        }

        $id = $this->productRepo->create($data);
        $this->stockRepo->adjustWarehouse($id, 0);

        if (!empty($body['base_price']) && !empty($body['mrp'])) {
            $base = (float)$body['base_price'];
            $mrp  = (float)$body['mrp'];
            if ($mrp <= $base) {
                sendError('MRP must be higher than Base Price', 400);
            }
            $this->productRepo->setPrice($id, $base, $mrp);
        }

        sendSuccess($this->productRepo->findById($id), 'Product created', 201);
    }

    // ─── PUT (Update) ────────────────────────────────────────────────────────

    private function updateProduct(): void {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) sendError('Product ID required', 400);

        if (($_GET['action'] ?? '') === 'toggle') {
            $p = $this->productRepo->findById($id);
            if (!$p) sendError('Not found', 404);
            $s = $p['status'] === 'Active' ? 'Inactive' : 'Active';
            $this->productRepo->setStatus($id, $s);
            sendSuccess(['status' => $s], 'Updated');
        }

        $isMultipart = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
        $body = $isMultipart ? $_POST : getBody();

        $existing = $this->productRepo->findById($id);
        if (!$existing) sendError('Product not found', 404);

        $data = [
            'category_id'  => (int)($body['category_id']  ?? $existing['category_id']),
            'product_name' => trim($body['product_name']   ?? $existing['product_name']),
            'description'  => trim($body['description']    ?? $existing['description'] ?? '') ?: null,
            'unit'         => trim($body['unit']           ?? $existing['unit']        ?? '') ?: null,
            'image_url'    => $existing['image_url'],
        ];

        // Replace image if a new one was uploaded
        if (!empty($_FILES['image']['tmp_name'])) {
            // Delete old image file if it exists
            if ($existing['image_url']) {
                $oldPath = self::UPLOAD_DIR . $existing['image_url'];
                if (file_exists($oldPath)) @unlink($oldPath);
            }
            $data['image_url'] = $this->saveImage($_FILES['image']);
        }

        $this->productRepo->update($id, $data);
        if (!empty($body['status']) && in_array($body['status'], ['Active', 'Inactive'])) {
            $this->productRepo->setStatus($id, $body['status']);
        }
        sendSuccess($this->productRepo->findById($id), 'Updated');
    }

    // ─── Categories / Pricing ─────────────────────────────────────────────────

    private function createCategory(): void {
        $body = getBody();
        if (empty($body['category_name'])) sendError('category_name required', 400);
        $id = $this->productRepo->createCategory($body);
        sendSuccess(['category_id' => $id], 'Created', 201);
    }

    private function updateCategory(): void {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) sendError('Category ID required', 400);
        $this->productRepo->updateCategory($id, getBody());
        sendSuccess(null, 'Updated');
    }

    private function deleteCategory(): void {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) sendError('Category ID required', 400);
        try {
            $this->productRepo->deleteCategory($id);
            sendSuccess(null, 'Deleted');
        } catch (Exception $e) {
            // Check if foreign key constraint error
            if (str_contains($e->getMessage(), 'FOREIGN KEY') || str_contains($e->getMessage(), '1217') || str_contains($e->getMessage(), '1451')) {
                throw new Exception('Cannot delete category because it contains active products.', 409);
            }
            throw $e;
        }
    }

    private function setPrice(): void {
        $body = getBody();
        $id   = (int)($body['product_id'] ?? 0);
        if (!$id || !isset($body['base_price'], $body['mrp'])) {
            sendError('product_id, base_price, mrp required', 400);
        }
        $base = (float)$body['base_price'];
        $mrp  = (float)$body['mrp'];
        if ($mrp <= $base) {
            sendError('MRP must be higher than Base Price', 400);
        }
        $this->productRepo->setPrice($id, $base, $mrp);
        sendSuccess(null, 'Pricing updated');
    }

    // ─── Image Helper ─────────────────────────────────────────────────────────

    private function saveImage(array $file): string {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Image upload failed (error code ' . $file['error'] . ')', 400);
        }
        if ($file['size'] > self::MAX_SIZE_BYTES) {
            throw new Exception('Image must be under 2 MB', 400);
        }

        // Verify MIME from actual file content, not just the extension
        $finfo    = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!array_key_exists($mimeType, self::ALLOWED_TYPES)) {
            throw new Exception('Only JPG, PNG and WEBP images are allowed', 400);
        }

        $ext      = self::ALLOWED_TYPES[$mimeType];
        $filename = 'prod_' . uniqid('', true) . '.' . $ext;
        $dest     = self::UPLOAD_DIR . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            throw new Exception('Could not save image', 500);
        }

        return $filename;
    }

    private function deleteProduct(): void {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) sendError('Product ID required', 400);

        $product = $this->productRepo->findById($id);
        if (!$product) sendError('Product not found', 404);

        if ($this->productRepo->hasOrderOrSupplyHistory($id)) {
            sendError('Cannot delete product because it has active order or supply history. You can deactivate it instead.', 409);
        }

        // Delete any uploaded image from disk if it exists
        if ($product['image_url']) {
            $oldPath = self::UPLOAD_DIR . $product['image_url'];
            if (file_exists($oldPath)) @unlink($oldPath);
        }

        $this->productRepo->delete($id);
        sendSuccess(null, 'Product deleted successfully');
    }
}
