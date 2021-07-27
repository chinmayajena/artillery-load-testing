
const fs = require("fs");
const filePath = "./post-data.txt";
let postData;

/**
 * Generates post body
 */
const generatePostBody = async (userContext, events, done) => {
  try{
    // add variables to virtual user's context:
    if(postData === undefined || postData === null || postData.length === 0) {
      postData = await loadDataFromTxt(filePath);
    }
    const postBodyStr = postData[Math.floor(Math.random()*postData.length)];
    userContext.vars.data = JSON.parse(postBodyStr);

    // continue with executing the scenario:
    return done();

  } catch(err) {
    console.log(`Error occurred in function generatePostBody. Detail: ${err}`);
    throw(err);
  }
}

/**
 * Loads post body from csv file
 * @param {object} filePath - The path of csv file
 */
const loadDataFromCsv = async filePath => {
  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({delimiter: '||'}))
      .on("data", data => data.push(data))
      .on("end", () => {
        return resolve(data);
      })
      .on("error", error => {
        return reject(error);
      });
  });
};

/**
 * Loads post body from text file
 * @param {object} filePath - The path of text file
 */
const loadDataFromTxt = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.toString().split("\n"));
    });
  });
}

// Load data from txt file once at the start of the execution
// and save the results in a global variable
(async () => {
  try {
  postData = await loadDataFromTxt(filePath);
  //console.log(JSON.parse(postData[0]));
  } catch (error) {
    console.log(`Error occurred in main. Detail: ${err}`);
  }
})();

module.exports.generatePostBody = generatePostBody; 