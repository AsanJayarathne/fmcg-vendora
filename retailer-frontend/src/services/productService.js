import { apiFetch } from "../utils/api";

/**
 * Fetch products AND categories in a single request.
 * Backend: GET /api/retailer/products.php
 * Backend: GET /api/retailer/products.php?category_id=X
 *
 * The backend returns:
 * { success: true, data: { products: [...], categories: [...] } }
 *
 * @param {string} token
 * @param {number|null} categoryId  — null means "all categories"
 * @returns {Promise<{ products: Array, categories: Array }>}
 */
export async function fetchProductsWithCategories(token, categoryId = null) {
  const path = categoryId
    ? `/retailer/products.php?category_id=${categoryId}`
    : "/retailer/products.php";

  const result = await apiFetch(path, token);

  return {
    products:   result.data?.products   ?? [],
    categories: result.data?.categories ?? [],
  };
}
