# Test Cases — POST /api/cart/add

**Endpoint:** `POST /api/cart/add`  
**Body:** `{ "product_id": integer, "quantity": integer }`  
**Auth:** Bearer token required

| # | Scenario | Input | Expected HTTP Status |
|---|---|---|---|
| 1 | Valid request — happy path | Valid `product_id`, `quantity: 1`, valid Bearer token | 201 Created |
| 2 | Missing Authorization header | Valid body, no `Authorization` header | 401 Unauthorized |
| 3 | *(security)* Tampered / expired Bearer token | Valid body, `Authorization: Bearer invalid.token.here` | 401 Unauthorized |
| 4 | Product does not exist | `product_id: 999999`, valid `quantity`, valid token | 404 Not Found |
| 5 | *(boundary)* quantity = 0 | `product_id` valid, `quantity: 0`, valid token | 422 Unprocessable Entity |
| 6 | *(boundary)* quantity = -1 | `product_id` valid, `quantity: -1`, valid token | 422 Unprocessable Entity |
| 7 | Required field missing — product_id omitted | `{ "quantity": 1 }`, valid token | 400 Bad Request |
| 8 | *(security)* Wrong type for product_id — string passed | `{ "product_id": "1; DROP TABLE products", "quantity": 1 }`, valid token | 400 Bad Request |

## Notes

- Cases 2 & 3 verify the auth layer independently — a missing header and a bad token are distinct failure modes.
- Cases 5 & 6 cover the lower quantity boundary; an upper boundary case (e.g. `quantity: 2147483647`) is a candidate follow-up if the API has stock limits.
- Case 8 doubles as a basic injection probe — the API should reject non-integer input before it reaches any query layer.
- Expected status for validation errors (5, 6, 7) may be 400 depending on the API's convention; 422 is the more semantically correct choice for well-formed requests with invalid values.
