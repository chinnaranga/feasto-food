// uploadData.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Your service account key
const data = require('./mock-data.json'); // Your dataset

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// The name of the collection you want to populate
const collectionName = 'projects';
const collectionRef = db.collection(collectionName);

async function uploadData() {
  console.log(`Uploading data to '${collectionName}' collection...`);

  // Firestore batch write can handle up to 500 operations at once
  const batch = db.batch();

  data.forEach(doc => {
    // Use the 'id' from your JSON as the document ID in Firestore
    const docRef = collectionRef.doc(doc.id);
    batch.set(docRef, doc);
  });

  try {
    await batch.commit();
    console.log('✅ Data successfully uploaded!');
  } catch (error) {
    console.error('❌ Error uploading data:', error);
  }
}

uploadData();