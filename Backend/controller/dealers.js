const { db } = require("../firebase");

const createDealer = async (req, res) => {
  console.log(req.body);
  console.log("hello from dealer");

  const password = process.env.PASS;
  console.log("pass",password);
  
  const { name, email,image } = req.body;

  try {
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
    console.log("dealersnapshot", dealerSnapshot.empty);
    console.log("customersnapshot", customerSnapshot.empty);

    await db.collection("dealers").add({
      name,
      email,
      image,
      password,
    });

    res.send({ msg: "Dealer Created Succesfully" });
  } catch (error) {
    console.error("Error creating dealer:", error);
    res.status(500).send("An error occurred while creating the dealer");
  }
};

const updateDealer = async (req, res) => {
  const { name, email, password, image } = req.body; 
  const { id } = req.params;

  console.log("Request Body:", req.body);
  console.log("Request Params:", req.params);

  try {
    const dealerRef = db.collection("dealers").doc(id);
    const dealerDoc = await dealerRef.get();

    if (!dealerDoc.exists) {
      return res.status(404).send({ msg: "Dealer not found" });
    }

    const currentDealerData = dealerDoc.data();
    const currentEmail = currentDealerData.email;

    if (email && email !== currentEmail) {
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

    await dealerRef.update(updateData);

    res.send({ msg: "Dealer Updated Successfully" });
  } catch (error) {
    res.status(500).send({ msg: "An error occurred while updating the dealer", error: error.message });
  }
};





const getAllDealer = async (req, res) => {
  try {
    const querySnapshot = await db.collection("dealers").get();
    const dealers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(dealers);
  } catch (error) {
    console.error(error);
  }
};

const getDealer = async (req, res) => {
  console.log("hello from getDealer");

  const id = req.params.id;

  try {
    const docRef = db.collection("dealers").doc(id);

    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).send({ message: "Dealer not found" });
    }

    const dealer = docSnapshot.data();

    res.status(200).send({ id: docSnapshot.id, ...dealer });
  } catch (error) {
    console.error("Error fetching dealer:", error);
    res.status(500).send({ message: "Server error" });
  }
};

const deleteDealers = async (req, res) => {
  await db.collection("dealers").doc(req.params.id).delete();
  res.send("Dealer deleted Successfully");
};

module.exports = {
  createDealer,
  updateDealer,
  getAllDealer,
  deleteDealers,
  getDealer,
};
