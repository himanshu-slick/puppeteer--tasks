import puppeteer from "puppeteer";

(async () => {
  const waitForTimeout = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay || 1000));
  };

  // Setting up Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  // Setting viewport and user agent
  await page.setViewport({ width: 1300, height: 700 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  // Navigating to the target website
  await page.goto("https://easyupload.io/");

  // Waiting for the image file input selector
  await page.waitForSelector("input[type=file]");
  await waitForTimeout(1000);

  // Getting the image file input element handle
  const fileInput = await page.$("input[type=file]");

  // Preparing the image file to upload
  const fileToUpload = "image.jpg";

  // Uploading the image file
  await fileInput.uploadFile(fileToUpload);

  // Triggering the image file upload
  await page.waitForSelector("#upload");
  await page.evaluate(() => document.getElementById("upload").click());

  // Waiting for the uploaded image URL
  await page.waitForSelector("#upload-link");
  await waitForTimeout(5000);

  // Getting the download URL
  const downloadUrl = await page.evaluate(() => {
    return document.getElementById("upload-links").value;
  });

  // Displaying the result on console
  console.log({
    Image_File: fileToUpload,
    Download_URL: downloadUrl,
  });

  // Closing the browser
  await browser.close();
})();
