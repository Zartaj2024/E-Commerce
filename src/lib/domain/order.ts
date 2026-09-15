export type OrderStatus =
  | "payment_confirmed"
  | "in_production"
  | "quality_check"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "stripe" | "bank_transfer" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed";

export type OrderItemType = "catalog" | "custom";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_address_id: string;
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: OrderItemType;
  product_variant_id: string | null;
  custom_order_request_id: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface OrderWithDetails extends Order {
  order_items: (OrderItem & {
    product_variants?: {
      id: string;
      fabric: string | null;
      color: string | null;
      size: string | null;
      products?: {
        name: string;
        slug: string;
        product_images?: { url: string; alt_text: string }[];
      };
    };
    custom_order_requests?: {
      id: string;
      reference_image_url: string;
      fabric: string;
      size_placement: string;
    };
  })[];
  addresses?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    postal_code: string | null;
  };
}
