/* eslint-disable no-undef */
//
//https://github.com/PacktPublishing/Hands-on-Machine-Learning-with-TensorFlow.js/tree/master/Section5_4
//
const tf = require("@tensorflow/tfjs");
//require('@tensorflow/tfjs-node');
//load iris training and testing data
const iris = require("../../iris.json");
const irisTesting = require("../../iris-testing.json");
var lossValue;

exports.trainAndPredict = function (req, res) {
  // Extract parameters from the request body
  const {
    sepalLength,
    sepalWidth,
    petalLength,
    petalWidth,
    epochs,
    learningRate,
  } = req.query;

  console.log(irisTesting);

  // Convert/setup the provided data for TensorFlow.js
  const trainingData = tf.tensor2d(
    iris.map((item) => [
      item.sepal_length,
      item.sepal_width,
      item.petal_length,
      item.petal_width,
    ])
  );

  const outputData = tf.tensor2d(
    iris.map((item) => [
      item.species === "setosa" ? 1 : 0,
      item.species === "virginica" ? 1 : 0,
      item.species === "versicolor" ? 1 : 0,
    ])
  );

  const testingData = tf.tensor2d([
    [
      parseFloat(sepalLength),
      parseFloat(sepalWidth),
      parseFloat(petalLength),
      parseFloat(petalWidth),
    ],
  ]);

  // Build neural network using a sequential model
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [4],
      activation: "sigmoid",
      units: 10,
    })
  );
  model.add(
    tf.layers.dense({
      inputShape: [10],
      activation: "sigmoid",
      units: 5,
    })
  );
  model.add(
    tf.layers.dense({
      activation: "sigmoid",
      units: 3,
    })
  );

  // Compile the model
  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(parseFloat(learningRate)), // Convert learning rate to float
  });

  console.log(model.summary());

  // Train the model and predict the results for testing data
  async function run() {
    const startTime = Date.now();

    await model.fit(trainingData, outputData, {
      epochs: parseInt(epochs), // Convert epochs to integer
      callbacks: {
        onEpochEnd: async (epoch, log) => {
          lossValue = log.loss;
          console.log(`Epoch ${epoch}: lossValue = ${log.loss}`);
          elapsedTime = Date.now() - startTime;
          console.log("elapsed time: " + elapsedTime);
        },
      },
    });

    const results = model.predict(testingData);

    results.array().then((array) => {
      const species = ["setosa", "virginica", "versicolor"];
      const predictedSpeciesIndex = array[0].indexOf(Math.max(...array[0]));
      const predictedSpecies = species[predictedSpeciesIndex];

      console.log(array[0]);
      var dataToSend = {
        rawValues: array[0],
        species: predictedSpecies,
      };
      console.log(dataToSend);
      res.status(200).send(dataToSend);
    });
  }

  // Call the run function
  run();
};
