const { Timestamp } = require("firebase-admin/firestore");
const { db } = require("../firebase");

const createCustomer = async (req, res) => {
  try {
    const { name, email,image } = req.body;
    const password = process.env.PASS;
    const dealerId = req.params.id;

    const dealerDoc = await db.collection("dealers").doc(dealerId).get();
    if (!dealerDoc.exists) {
      return res.status(400).send({ msg: "Dealer not found" });
    }

    const customerSnapshot = await db
      .collection("customers")
      .where("email", "==", email)
      .get();
    const dealerSnapshot = await db
      .collection("dealers")
      .where("email", "==", email)
      .get();
    if (!customerSnapshot.empty || !dealerSnapshot.empty) {
      return res.status(400).send({ msg: "This email is already exists" });
    }

    const newCustomerRef = await db.collection("customers").add({
      name,
      email,
      image,
      password,
      dealers: req.params.id,
    });

    res.send({
      msg: "Customer created successfully",
      newCustomerRef,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const updateCustomer = async (req, res) => {
  const { name, email, password,image } = req.body;
  const { id } = req.params;

  try {
    const customerRef = db.collection("customers").doc(id);
    const customerDoc = await customerRef.get();

    if (!customerDoc.exists) {
      return res.status(404).send({ msg: "Customer not found" });
    }

    const currentEmail = customerDoc.data().email;
console.log('currentEmail',currentEmail);

    if (email !== currentEmail) {
      const customerSnapshot = await db
        .collection("customers")
        .where("email", "==", email)
        .get();

      const dealerSnapshot = await db
        .collection("dealers")
        .where("email", "==", email)
        .get();

      if (!customerSnapshot.empty || !dealerSnapshot.empty) {
        return res.status(400).send({ msg: "Email Already Exists" });
      }
    }
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    if (password !== undefined) {
      updateData.password = password;
    }
    if (image !== undefined) {
      updateData.image = image;
    }

    await customerRef.update(updateData);
    await customerRef.update({ name, email, password,image });

    res.send({ msg: "Customer Updated Successfully" });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).send({ msg: "An error occurred while updating the customer" });
  }
};



const getCustomer = async (req, res) => {
  console.log("hello from getCustomer");

  const id = req.params.id;

  try {
    const docRef = db.collection("customers").doc(id);

    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).send({ message: "Customers not found" });
    }

    const customer = docSnapshot.data();

    res.status(200).send({ id: docSnapshot.id, ...customer });
  } catch (error) {
    console.error("Error fetching Customer:", error);
    res.status(500).send({ message: "Server error" });
  }
};

const fetchCustomersByDealer = async (req, res) => {
  const dealerId = req.params.id;

  try {
    const querySnapshot = await db
      .collection("customers")
      .where("dealers", "==", dealerId)
      .get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .send({ message: "No customers found for this dealer" });
    }

    const customers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.send(customers);
  } catch (error) {
    console.error("Error getting customers:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching customers" });
  }
};

const deleteCustomer = async (req, res) => {
  await db.collection("customers").doc(req.params.id).delete();
  res.send("Customer Deleted Successfully");
};

module.exports = {
  createCustomer,
  updateCustomer,
  fetchCustomersByDealer,
  deleteCustomer,
  getCustomer,
};
