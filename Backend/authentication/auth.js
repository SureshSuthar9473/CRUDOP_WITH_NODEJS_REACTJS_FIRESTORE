const { db } = require("../firebase");

const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  console.log("hello from login", process.env.ADMIN_EMAIL);

  const { email, password } = req.body;

  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL, role: "admin" },
        "your_jwt_secret",
        { expiresIn: "2d" }
      );
      return res.json({ role: "admin", token });
    }

    let dealerSnapshot = await db
      .collection("dealers")
      .where("email", "==", email)
      .get();
    console.log("dealerSnapshot", dealerSnapshot);

    if (!dealerSnapshot.empty) {
      const dealer = dealerSnapshot.docs[0].data();
      const dealerId = dealerSnapshot.docs[0].id;

      if (password === dealer.password) {
        const token = jwt.sign(
          { email: dealer.email, role: "dealer" },
          "your_jwt_secret",
          { expiresIn: "1h" }
        );
        return res.json({ role: "dealer", token, id: dealerId });
      }
    }

    let customerSnapshot = await db
      .collection("customers")
      .where("email", "==", email)
      .get();

    if (!customerSnapshot.empty) {
      const customer = customerSnapshot.docs[0].data();

      if (password === customer.password) {
        const token = jwt.sign(
          { email: customer.email, role: "customer" },
          "your_jwt_secret",
          { expiresIn: "1h" }
        );
        return res.json({ role: "customer", token });
      }
    }

    res.status(401).send("Invalid email or password");
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  Login,
};
