new Vue({
  el: "#app",
  data: {
    lessons: [],
    cart: [],
    showCart: false,
    message: ""
  },
  created() {
    fetch("http://localhost:3000/lessons")
      .then(res => res.json())
      .then(data => this.lessons = data);
  },
  computed: {
    cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },
  methods: {
    addToCart(lesson) {
      const existing = this.cart.find(i => i._id === lesson._id);
      if (existing) {
        if (existing.quantity < lesson.space) {
          existing.quantity++;
        }
      } else {
        this.cart.push({
          _id: lesson._id,
          subject: lesson.subject,
          price: lesson.price,
          quantity: 1
        });
      }
    },
    clearCart() {
      this.cart = [];
      this.message = "";
    },
    checkout() {
      fetch("http://localhost:3000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: this.cart })
      })
        .then(res => res.json())
        .then(async data => {
          if (data.message === "Booking successful") {
            this.cart = [];
            const updated = await fetch("http://localhost:3000/lessons").then(r => r.json());
            this.lessons = updated;
            this.message = " Booking successful!";
          } else {
            this.message = " Booking failed: Not enough space";
          }
        });
    }
  }
});
