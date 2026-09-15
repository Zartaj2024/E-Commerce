import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Design tokens (from the Design Document)
// ---------------------------------------------------------------------------
const C = {
  kora: "#F2ECDD",
  ink: "#2B211C",
  mahogany: "#7A2331",
  peacock: "#0F5C57",
  gold: "#B8860B",
  charcoal: "#4A4038",
};

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------
const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Anaar phulkari shawl",
    category: "Shawls",
    description:
      "Hand-embroidered phulkari shawl with pomegranate motifs, worked on hand-loomed khaddar over several weeks.",
    basePrice: 6500,
    active: true,
    variants: [
      { id: "v1", fabric: "Khaddar", color: "Maroon", size: "One size", priceModifier: 0, stock: 4 },
      { id: "v2", fabric: "Khaddar", color: "Indigo", size: "One size", priceModifier: 300, stock: 2 },
    ],
  },
  {
    id: "p2",
    name: "Gulmohar kurta",
    category: "Kurtas",
    description: "Chikankari-inspired floral kurta in soft lawn, finished with a hand-stitched hem.",
    basePrice: 4200,
    active: true,
    variants: [
      { id: "v3", fabric: "Lawn", color: "Ivory", size: "M", priceModifier: 0, stock: 6 },
      { id: "v4", fabric: "Lawn", color: "Ivory", size: "L", priceModifier: 0, stock: 3 },
      { id: "v5", fabric: "Lawn", color: "Dusty rose", size: "M", priceModifier: 200, stock: 1 },
    ],
  },
  {
    id: "p3",
    name: "Neelam cushion pair",
    category: "Home",
    description: "A pair of mirror-work cushion covers in deep indigo, backed in raw cotton.",
    basePrice: 2800,
    active: true,
    variants: [
      { id: "v6", fabric: "Cotton", color: "Indigo", size: "16x16 in", priceModifier: 0, stock: 8 },
    ],
  },
  {
    id: "p4",
    name: "Zaitoon table runner",
    category: "Home",
    description: "Olive-branch thread work on natural linen — a table runner for six place settings.",
    basePrice: 3100,
    active: true,
    variants: [
      { id: "v7", fabric: "Linen", color: "Olive", size: "72 in", priceModifier: 0, stock: 5 },
    ],
  },
];

const FABRICS = ["Cotton", "Khaddar", "Lawn", "Linen", "Silk"];
const THREAD_COLORS = ["Mahogany", "Peacock", "Gold", "Ivory", "Indigo", "Rose"];

const money = (n) => `Rs. ${n.toLocaleString("en-PK")}`;

// ---------------------------------------------------------------------------
// 3D thread hero
// ---------------------------------------------------------------------------
function ThreadHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const threadColors = [0x7a2331, 0x0f5c57, 0xb8860b, 0x2b211c];
    const threads = [];

    function buildCurve(seed) {
      const pts = [];
      const n = 6;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        pts.push(
          new THREE.Vector3(
            (t - 0.5) * 7 + Math.sin(seed + t * 4) * 0.6,
            Math.sin(t * Math.PI * 2 + seed) * 2.2,
            Math.cos(t * Math.PI * 1.5 + seed) * 1.6
          )
        );
      }
      return new THREE.CatmullRomCurve3(pts);
    }

    threadColors.forEach((color, i) => {
      const curve = buildCurve(i * 1.7);
      const points = curve.getPoints(120);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
      const line = new THREE.Line(geometry, material);
      group.add(line);
      threads.push({ line, seed: i * 1.7, curve });
    });

    const pointer = { x: 0, y: 0 };
    function onPointerMove(e) {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
    mount.addEventListener("pointermove", onPointerMove);

    let raf;
    let t = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!reduced) {
        t += 0.005;
        threads.forEach(({ line, seed }, i) => {
          const pts = [];
          const n = 6;
          for (let j = 0; j < n; j++) {
            const u = j / (n - 1);
            pts.push(
              new THREE.Vector3(
                (u - 0.5) * 7 + Math.sin(seed + u * 4 + t) * 0.6,
                Math.sin(u * Math.PI * 2 + seed + t * 1.3) * 2.2,
                Math.cos(u * Math.PI * 1.5 + seed + t) * 1.6
              )
            );
          }
          const curve = new THREE.CatmullRomCurve3(pts);
          line.geometry.setFromPoints(curve.getPoints(120));
        });
        group.rotation.y += 0.0015;
      }
      group.rotation.y += (pointer.x * 0.4 - group.rotation.y) * 0.02;
      group.rotation.x += (pointer.y * -0.2 - group.rotation.x) * 0.02;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointermove", onPointerMove);
      threads.forEach(({ line }) => {
        line.geometry.dispose();
        line.material.dispose();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Small shared bits
// ---------------------------------------------------------------------------
function StitchSwatch({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: `1px solid ${active ? C.mahogany : C.charcoal}`,
        background: active ? C.mahogany : "transparent",
        color: active ? C.kora : C.ink,
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending_review: { bg: C.charcoal, label: "Pending review" },
    quoted: { bg: C.gold, label: "Quoted" },
    declined: { bg: C.charcoal, label: "Declined" },
    payment_confirmed: { bg: C.peacock, label: "Payment confirmed" },
    in_production: { bg: C.peacock, label: "In production" },
    quality_check: { bg: C.peacock, label: "Quality check" },
    shipped: { bg: C.peacock, label: "Shipped" },
    delivered: { bg: C.mahogany, label: "Delivered" },
  };
  const s = map[status] || { bg: C.charcoal, label: status };
  return (
    <span
      style={{
        background: s.bg,
        color: C.kora,
        fontSize: 12,
        padding: "3px 10px",
        borderRadius: 999,
        fontFamily: "'Work Sans', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function ProductCard({ product, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onOpen(product.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          height: 220,
          background: "#E8DFC9",
          borderRadius: 4,
          border: hover ? `1.5px dashed ${C.mahogany}` : "1.5px solid transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          transition: "border 0.3s",
        }}
      >
        🧵
      </div>
      <div style={{ marginTop: 10, fontFamily: "'Work Sans', sans-serif" }}>
        <div style={{ fontSize: 16, color: C.ink }}>{product.name}</div>
        <div style={{ fontSize: 14, color: C.charcoal, marginTop: 2 }}>{money(product.basePrice)}</div>
      </div>
    </div>
  );
}

function Button({ children, onClick, variant = "primary", full, disabled }) {
  const styles = {
    primary: { background: C.mahogany, color: C.kora, border: "none" },
    secondary: { background: "transparent", color: C.ink, border: `1px solid ${C.ink}` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: "12px 22px",
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 15,
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: full ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: C.charcoal, marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  border: "none",
  borderBottom: `1.5px solid ${C.charcoal}`,
  background: "transparent",
  padding: "8px 2px",
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 15,
  color: C.ink,
  outline: "none",
  boxSizing: "border-box",
};

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
function HomePage({ products, nav }) {
  return (
    <div>
      <div style={{ position: "relative", height: 420, overflow: "hidden", background: C.ink }}>
        <ThreadHero />
        <div
          style={{
            position: "absolute",
            left: 32,
            bottom: 32,
            maxWidth: 420,
            pointerEvents: "none",
          }}
        >
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 44,
              color: C.kora,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Thread, held to the light.
          </h1>
          <p style={{ fontFamily: "'Work Sans', sans-serif", color: C.kora, opacity: 0.85, fontSize: 15 }}>
            Hand-embroidered pieces, and custom work made to your fabric, thread, and story.
          </p>
          <div style={{ pointerEvents: "auto", marginTop: 12 }}>
            <Button onClick={() => nav("products")}>Shop the collection</Button>
          </div>
        </div>
      </div>

      <div style={{ padding: "48px 32px" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: C.ink, marginBottom: 20 }}>
          Featured pieces
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
          {products.filter((p) => p.active).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} onOpen={(id) => nav("product", id)} />
          ))}
        </div>
      </div>

      <div style={{ padding: "0 32px 56px", display: "flex", gap: 32, flexWrap: "wrap" }}>
        {[
          ["1. Choose your fabric", "Cotton, khaddar, lawn, linen, or silk — pick what the piece will live on."],
          ["2. Choose your thread", "Colors drawn from the same palette as our finished work."],
          ["3. We stitch it by hand", "You'll get a quote before anything is made, and a status timeline after."],
        ].map(([title, body]) => (
          <div key={title} style={{ flex: "1 1 220px" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: C.mahogany, marginBottom: 6 }}>
              {title}
            </div>
            <div style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: C.charcoal }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsPage({ products, nav }) {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = products.filter((p) => p.active && (category === "All" || p.category === category));

  return (
    <div style={{ padding: "40px 32px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, color: C.ink, marginBottom: 24 }}>Products</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
        {categories.map((c) => (
          <StitchSwatch key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 28 }}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={(id) => nav("product", id)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ fontFamily: "'Work Sans', sans-serif", color: C.charcoal }}>
            Nothing in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailPage({ product, addToCart, nav, toast }) {
  const [variantId, setVariantId] = useState(product?.variants[0]?.id);
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const variant = product.variants.find((v) => v.id === variantId);
  const price = product.basePrice + variant.priceModifier;

  return (
    <div style={{ padding: "40px 32px", display: "flex", gap: 48, flexWrap: "wrap" }}>
      <div
        style={{
          flex: "1 1 340px",
          height: 380,
          background: "#E8DFC9",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
        }}
      >
        🧵
      </div>
      <div style={{ flex: "1 1 320px", fontFamily: "'Work Sans', sans-serif" }}>
        <button
          onClick={() => nav("products")}
          style={{ background: "none", border: "none", color: C.peacock, cursor: "pointer", padding: 0, marginBottom: 12 }}
        >
          ← Back to products
        </button>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink, margin: "0 0 8px" }}>
          {product.name}
        </h1>
        <div style={{ fontSize: 20, color: C.mahogany, marginBottom: 16 }}>{money(price)}</div>
        <p style={{ color: C.charcoal, fontSize: 15, lineHeight: 1.6 }}>{product.description}</p>

        <div style={{ margin: "20px 0" }}>
          <div style={{ fontSize: 13, color: C.charcoal, marginBottom: 8 }}>Fabric, color &amp; size</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {product.variants.map((v) => (
              <StitchSwatch
                key={v.id}
                label={`${v.fabric} · ${v.color} · ${v.size}`}
                active={v.id === variantId}
                onClick={() => setVariantId(v.id)}
              />
            ))}
          </div>
          <div style={{ fontSize: 13, color: variant.stock > 0 ? C.peacock : C.mahogany, marginTop: 8 }}>
            {variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtnStyle}>−</button>
          <span style={{ fontSize: 15 }}>{qty}</span>
          <button onClick={() => setQty(Math.min(variant.stock, qty + 1))} style={qtyBtnStyle}>+</button>
        </div>

        <Button
          disabled={variant.stock === 0}
          onClick={() => {
            addToCart(product, variant, qty);
            toast(`Added ${qty} × ${product.name} to cart`);
          }}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
const qtyBtnStyle = {
  width: 32,
  height: 32,
  border: `1px solid ${C.charcoal}`,
  background: "transparent",
  cursor: "pointer",
  fontSize: 16,
  borderRadius: 4,
};

function CustomOrderPage({ submitRequest, user, nav, toast }) {
  const [imageAlt, setImageAlt] = useState("");
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [threads, setThreads] = useState([]);
  const [sizePlacement, setSizePlacement] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function toggleThread(c) {
    setThreads((t) => (t.includes(c) ? t.filter((x) => x !== c) : [...t, c]));
  }

  function handleSubmit() {
    if (!imageAlt.trim() || threads.length === 0 || !sizePlacement.trim()) {
      setError("Describe your reference image, choose at least one thread color, and add a size — then you're set.");
      return;
    }
    if (!user) {
      toast("Please log in to submit a custom order request");
      nav("login");
      return;
    }
    setError("");
    submitRequest({ imageAlt, fabric, threads, sizePlacement, notes });
    toast("Custom order request submitted — you'll see it under Account once it's quoted.");
    nav("account");
  }

  return (
    <div style={{ padding: "40px 32px", maxWidth: 620 }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink }}>Commission a custom piece</h1>
      <p style={{ fontFamily: "'Work Sans', sans-serif", color: C.charcoal, fontSize: 14, marginBottom: 28 }}>
        Tell us what you have in mind. There's no charge yet — we'll send a quote once we've reviewed it.
      </p>

      <Field label="Describe your reference image (upload simulated in this prototype)">
        <input
          style={inputStyle}
          placeholder="e.g. a close-up of a rose motif from a family dupatta"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />
      </Field>

      <Field label="Fabric">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FABRICS.map((f) => (
            <StitchSwatch key={f} label={f} active={fabric === f} onClick={() => setFabric(f)} />
          ))}
        </div>
      </Field>

      <Field label="Thread colors (choose one or more)">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {THREAD_COLORS.map((c) => (
            <StitchSwatch key={c} label={c} active={threads.includes(c)} onClick={() => toggleThread(c)} />
          ))}
        </div>
      </Field>

      <Field label="Size &amp; placement">
        <input
          style={inputStyle}
          placeholder="e.g. full shawl, motif centered on one corner"
          value={sizePlacement}
          onChange={(e) => setSizePlacement(e.target.value)}
        />
      </Field>

      <Field label="Notes (optional)">
        <textarea
          style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

      {error && (
        <div style={{ color: C.mahogany, fontFamily: "'Work Sans', sans-serif", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <Button onClick={handleSubmit}>Submit request</Button>
    </div>
  );
}

function CartPage({ cart, updateQty, removeItem, nav }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ padding: "40px 32px", display: "flex", gap: 40, flexWrap: "wrap" }}>
      <div style={{ flex: "2 1 380px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink, marginBottom: 20 }}>Cart</h1>
        {cart.length === 0 && (
          <p style={{ fontFamily: "'Work Sans', sans-serif", color: C.charcoal }}>
            Your cart is empty. <button onClick={() => nav("products")} style={linkBtn}>Browse products</button>
          </p>
        )}
        {cart.map((item) => (
          <div
            key={item.cartItemId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${C.charcoal}33`,
              padding: "16px 0",
              fontFamily: "'Work Sans', sans-serif",
            }}
          >
            <div>
              <div style={{ color: C.ink }}>{item.name}</div>
              <div style={{ fontSize: 13, color: C.charcoal }}>
                {item.fabric} · {item.color} · {item.size}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <button onClick={() => updateQty(item.cartItemId, Math.max(1, item.qty - 1))} style={qtyBtnStyle}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.cartItemId, item.qty + 1)} style={qtyBtnStyle}>+</button>
                <button onClick={() => removeItem(item.cartItemId)} style={{ ...linkBtn, marginLeft: 12 }}>
                  Remove
                </button>
              </div>
            </div>
            <div style={{ color: C.ink }}>{money(item.price * item.qty)}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: "1 1 260px" }}>
        <div style={{ background: "#EBE3D0", padding: 24, borderRadius: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Work Sans', sans-serif", marginBottom: 12 }}>
            <span>Subtotal</span>
            <span>{money(total)}</span>
          </div>
          <Button full disabled={cart.length === 0} onClick={() => nav("checkout")}>
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
const linkBtn = { background: "none", border: "none", color: C.peacock, cursor: "pointer", padding: 0, fontFamily: "'Work Sans', sans-serif", fontSize: 14 };

function CheckoutPage({ cart, user, placeOrder, nav }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [error, setError] = useState("");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!user) {
    return (
      <div style={{ padding: "40px 32px", fontFamily: "'Work Sans', sans-serif" }}>
        <p>You'll need to log in to check out.</p>
        <Button onClick={() => nav("login")}>Log in</Button>
      </div>
    );
  }

  function handlePlace() {
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Fill in your name, phone, address, and city to continue.");
      return;
    }
    setError("");
    const orderId = placeOrder({ name, phone, address, city, method });
    nav("confirmation", orderId);
  }

  return (
    <div style={{ padding: "40px 32px", display: "flex", gap: 40, flexWrap: "wrap" }}>
      <div style={{ flex: "2 1 360px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink, marginBottom: 20 }}>Checkout</h1>
        <Field label="Full name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Phone"><input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label="Address"><input style={inputStyle} value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
        <Field label="City"><input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} /></Field>
        <Field label="Payment method">
          <div style={{ display: "flex", gap: 8 }}>
            {[["bank_transfer", "Bank transfer"], ["cod", "Cash on delivery"], ["stripe", "Card (Stripe test)"]].map(
              ([id, label]) => (
                <StitchSwatch key={id} label={label} active={method === id} onClick={() => setMethod(id)} />
              )
            )}
          </div>
        </Field>
        {error && <div style={{ color: C.mahogany, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <Button onClick={handlePlace}>Place order</Button>
      </div>
      <div style={{ flex: "1 1 240px" }}>
        <div style={{ background: "#EBE3D0", padding: 24, borderRadius: 4, fontFamily: "'Work Sans', sans-serif" }}>
          {cart.map((i) => (
            <div key={i.cartItemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
              <span>{i.name} × {i.qty}</span>
              <span>{money(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.charcoal}55`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationPage({ order, nav }) {
  if (!order) return null;
  return (
    <div style={{ padding: "60px 32px", textAlign: "center", fontFamily: "'Work Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink }}>Order placed</h1>
      <p style={{ color: C.charcoal }}>
        Order <strong style={{ color: C.ink }}>#{order.id}</strong> — total {money(order.total)}. We'll email you as it moves through production.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
        <Button onClick={() => nav("account")}>Track this order</Button>
        <Button variant="secondary" onClick={() => nav("products")}>Keep browsing</Button>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{ padding: "48px 32px", maxWidth: 640, fontFamily: "'Work Sans', sans-serif", color: C.ink }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 34 }}>About the brand</h1>
      <p style={{ lineHeight: 1.7, color: C.charcoal }}>
        Every piece here starts as thread on a table, not a factory line. What you see in the catalog is made in
        small batches; what you commission is made once, for you, from a conversation about fabric and color.
      </p>
      <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.mahogany, margin: "24px 0" }}>
        "The stitch is slower than the machine. That's the point."
      </p>
    </div>
  );
}

function LoginPage({ login, nav }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("Enter both an email and a password to continue.");
      return;
    }
    login(email);
    nav("account");
  }

  return (
    <div style={{ padding: "60px 32px", maxWidth: 380, fontFamily: "'Work Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink }}>Log in</h1>
      <p style={{ fontSize: 13, color: C.charcoal, marginBottom: 20 }}>
        Prototype note: any email works. Use an email containing "admin" to preview the admin dashboard.
      </p>
      <Field label="Email"><input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <Field label="Password"><input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
      {error && <div style={{ color: C.mahogany, fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <Button full onClick={handleSubmit}>Log in</Button>
    </div>
  );
}

function AccountPage({ user, orders, customOrders, nav }) {
  if (!user) {
    return (
      <div style={{ padding: "40px 32px", fontFamily: "'Work Sans', sans-serif" }}>
        <p>Log in to see your account.</p>
        <Button onClick={() => nav("login")}>Log in</Button>
      </div>
    );
  }
  return (
    <div style={{ padding: "40px 32px", fontFamily: "'Work Sans', sans-serif", maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, color: C.ink }}>Your account</h1>
      <p style={{ color: C.charcoal, marginBottom: 28 }}>{user.email}</p>

      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.ink, marginBottom: 12 }}>Orders</h2>
      {orders.length === 0 && <p style={{ color: C.charcoal, fontSize: 14 }}>No orders yet.</p>}
      {orders.map((o) => (
        <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.charcoal}33` }}>
          <span>#{o.id} — {money(o.total)}</span>
          <StatusBadge status={o.status} />
        </div>
      ))}

      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.ink, margin: "28px 0 12px" }}>Custom order requests</h2>
      {customOrders.length === 0 && <p style={{ color: C.charcoal, fontSize: 14 }}>None yet — commission a piece any time.</p>}
      {customOrders.map((r) => (
        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.charcoal}33` }}>
          <span>{r.imageAlt} {r.quotedPrice ? `— ${money(r.quotedPrice)}` : ""}</span>
          <StatusBadge status={r.status} />
        </div>
      ))}
    </div>
  );
}

function AdminPage({ products, orders, customOrders, quoteRequest, declineRequest, updateOrderStatus, addProduct, toggleActive }) {
  const [tab, setTab] = useState("dashboard");
  const [quoteDrafts, setQuoteDrafts] = useState({});
  const [newProduct, setNewProduct] = useState({ name: "", category: "", basePrice: "" });

  const tabs = [
    ["dashboard", "Dashboard"],
    ["products", "Products"],
    ["orders", "Orders"],
    ["custom", "Custom order requests"],
  ];

  return (
    <div style={{ display: "flex", minHeight: 500, fontFamily: "'Work Sans', sans-serif" }}>
      <div style={{ width: 200, borderRight: `1px solid ${C.charcoal}33`, padding: "32px 16px" }}>
        {tabs.map(([id, label]) => (
          <div
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: "10px 12px",
              cursor: "pointer",
              color: tab === id ? C.mahogany : C.ink,
              fontWeight: tab === id ? 500 : 400,
              fontSize: 14,
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 32 }}>
        {tab === "dashboard" && (
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 20 }}>Dashboard</h1>
            <div style={{ display: "flex", gap: 24 }}>
              <StatBox label="Products" value={products.filter((p) => p.active).length} />
              <StatBox label="Orders" value={orders.length} />
              <StatBox
                label="Pending custom requests"
                value={customOrders.filter((r) => r.status === "pending_review").length}
              />
            </div>
          </div>
        )}

        {tab === "products" && (
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 20 }}>Products</h1>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <input style={{ ...inputStyle, width: 160 }} placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              <input style={{ ...inputStyle, width: 140 }} placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              <input style={{ ...inputStyle, width: 100 }} placeholder="Price" value={newProduct.basePrice} onChange={(e) => setNewProduct({ ...newProduct, basePrice: e.target.value })} />
              <Button
                onClick={() => {
                  if (!newProduct.name || !newProduct.category || !newProduct.basePrice) return;
                  addProduct(newProduct);
                  setNewProduct({ name: "", category: "", basePrice: "" });
                }}
              >
                Add product
              </Button>
            </div>
            {products.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.charcoal}33` }}>
                <span style={{ opacity: p.active ? 1 : 0.4 }}>{p.name} — {money(p.basePrice)}</span>
                <button style={linkBtn} onClick={() => toggleActive(p.id)}>
                  {p.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 20 }}>Orders</h1>
            {orders.length === 0 && <p style={{ color: C.charcoal }}>No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.charcoal}33` }}>
                <span>#{o.id} — {o.name} — {money(o.total)}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                  style={{ fontFamily: "'Work Sans', sans-serif", padding: 6 }}
                >
                  {["payment_confirmed", "in_production", "quality_check", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {tab === "custom" && (
          <div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 20 }}>Custom order requests</h1>
            {customOrders.length === 0 && <p style={{ color: C.charcoal }}>No requests yet.</p>}
            {customOrders.map((r) => (
              <div key={r.id} style={{ padding: "14px 0", borderBottom: `1px solid ${C.charcoal}33` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{r.imageAlt} — {r.fabric}, {r.threads.join("/")}, {r.sizePlacement}</span>
                  <StatusBadge status={r.status} />
                </div>
                {r.status === "pending_review" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      style={{ ...inputStyle, width: 100 }}
                      placeholder="Price"
                      value={quoteDrafts[r.id] || ""}
                      onChange={(e) => setQuoteDrafts({ ...quoteDrafts, [r.id]: e.target.value })}
                    />
                    <Button
                      onClick={() => {
                        const price = Number(quoteDrafts[r.id]);
                        if (!price) return;
                        quoteRequest(r.id, price);
                      }}
                    >
                      Send quote
                    </Button>
                    <Button variant="secondary" onClick={() => declineRequest(r.id)}>Decline</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function StatBox({ label, value }) {
  return (
    <div style={{ background: "#EBE3D0", padding: "18px 24px", borderRadius: 4 }}>
      <div style={{ fontSize: 28, fontFamily: "'Fraunces', serif", color: C.mahogany }}>{value}</div>
      <div style={{ fontSize: 13, color: C.charcoal }}>{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell: header, footer, toast
// ---------------------------------------------------------------------------
function Header({ nav, cartCount, user, logout, page }) {
  const navItem = (id, label) => (
    <span
      onClick={() => nav(id)}
      style={{
        cursor: "pointer",
        color: page === id ? C.mahogany : C.ink,
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 15,
      }}
    >
      {label}
    </span>
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: `1px solid ${C.charcoal}33`,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div onClick={() => nav("home")} style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: C.ink, cursor: "pointer" }}>
        Suti &amp; thread
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        {navItem("home", "Home")}
        {navItem("products", "Products")}
        {navItem("customOrder", "Custom order")}
        {navItem("about", "About")}
        <span onClick={() => nav("cart")} style={{ cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
          Cart ({cartCount})
        </span>
        {user ? (
          <>
            <span onClick={() => nav(user.role === "admin" ? "admin" : "account")} style={{ cursor: "pointer", fontFamily: "'Work Sans', sans-serif" }}>
              {user.role === "admin" ? "Admin" : "Account"}
            </span>
            <button onClick={logout} style={linkBtn}>Log out</button>
          </>
        ) : (
          navItem("login", "Log in")
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ padding: "32px", borderTop: `1px solid ${C.charcoal}33`, fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: C.charcoal }}>
      Made by hand, one piece at a time. — Suti &amp; thread
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: C.ink,
        color: C.kora,
        padding: "10px 20px",
        borderRadius: 4,
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 14,
        zIndex: 50,
      }}
    >
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const orderCounter = useRef(1000);
  const requestCounter = useRef(1);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  function nav(id, param) {
    setPage(id);
    if (param !== undefined) setSelectedId(param);
    window.scrollTo?.(0, 0);
  }

  function addToCart(product, variant, qty) {
    setCart((c) => {
      const existing = c.find((i) => i.variantId === variant.id);
      if (existing) {
        return c.map((i) => (i.variantId === variant.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...c,
        {
          cartItemId: `${product.id}-${variant.id}`,
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          fabric: variant.fabric,
          color: variant.color,
          size: variant.size,
          price: product.basePrice + variant.priceModifier,
          qty,
        },
      ];
    });
  }

  function updateQty(cartItemId, qty) {
    setCart((c) => c.map((i) => (i.cartItemId === cartItemId ? { ...i, qty } : i)));
  }
  function removeItem(cartItemId) {
    setCart((c) => c.filter((i) => i.cartItemId !== cartItemId));
  }

  function login(email) {
    setUser({ email, name: email.split("@")[0], role: email.toLowerCase().includes("admin") ? "admin" : "customer" });
  }
  function logout() {
    setUser(null);
    nav("home");
  }

  function placeOrder({ name, phone, address, city, method }) {
    const id = orderCounter.current++;
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    setOrders((o) => [
      ...o,
      { id, name, phone, address, city, method, total, status: "payment_confirmed", userEmail: user.email },
    ]);
    setCart([]);
    return id;
  }

  function submitRequest({ imageAlt, fabric, threads, sizePlacement, notes }) {
    const id = requestCounter.current++;
    setCustomOrders((r) => [
      ...r,
      { id, imageAlt, fabric, threads, sizePlacement, notes, status: "pending_review", quotedPrice: null, userEmail: user.email },
    ]);
  }
  function quoteRequest(id, price) {
    setCustomOrders((r) => r.map((x) => (x.id === id ? { ...x, status: "quoted", quotedPrice: price } : x)));
    setToastMsg("Quote sent to customer");
  }
  function declineRequest(id) {
    setCustomOrders((r) => r.map((x) => (x.id === id ? { ...x, status: "declined" } : x)));
  }
  function updateOrderStatus(id, status) {
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  }
  function addProduct({ name, category, basePrice }) {
    const id = `p${products.length + 1}`;
    setProducts((p) => [
      ...p,
      { id, name, category, description: "", basePrice: Number(basePrice), active: true, variants: [{ id: `${id}v1`, fabric: "Cotton", color: "Natural", size: "One size", priceModifier: 0, stock: 5 }] },
    ]);
    setToastMsg("Product added");
  }
  function toggleActive(id) {
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const selectedProduct = useMemo(() => products.find((p) => p.id === selectedId), [products, selectedId]);
  const myOrders = orders.filter((o) => o.userEmail === user?.email);
  const myCustomOrders = customOrders.filter((r) => r.userEmail === user?.email);
  const confirmedOrder = orders.find((o) => o.id === selectedId);

  return (
    <div style={{ background: C.kora, minHeight: "100%", color: C.ink }}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Work+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <Header nav={nav} cartCount={cartCount} user={user} logout={logout} page={page} />

      {page === "home" && <HomePage products={products} nav={nav} />}
      {page === "products" && <ProductsPage products={products} nav={nav} />}
      {page === "product" && <ProductDetailPage product={selectedProduct} addToCart={addToCart} nav={nav} toast={setToastMsg} />}
      {page === "customOrder" && <CustomOrderPage submitRequest={submitRequest} user={user} nav={nav} toast={setToastMsg} />}
      {page === "cart" && <CartPage cart={cart} updateQty={updateQty} removeItem={removeItem} nav={nav} />}
      {page === "checkout" && <CheckoutPage cart={cart} user={user} placeOrder={placeOrder} nav={nav} />}
      {page === "confirmation" && <ConfirmationPage order={confirmedOrder} nav={nav} />}
      {page === "about" && <AboutPage />}
      {page === "login" && <LoginPage login={login} nav={nav} />}
      {page === "account" && <AccountPage user={user} orders={myOrders} customOrders={myCustomOrders} nav={nav} />}
      {page === "admin" && (
        <AdminPage
          products={products}
          orders={orders}
          customOrders={customOrders}
          quoteRequest={quoteRequest}
          declineRequest={declineRequest}
          updateOrderStatus={updateOrderStatus}
          addProduct={addProduct}
          toggleActive={toggleActive}
        />
      )}

      <Footer />
      <Toast message={toastMsg} />
    </div>
  );
}
