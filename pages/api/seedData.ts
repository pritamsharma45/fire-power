export default async function handler(req, res) {
  const url =
    "https://script.google.com/macros/s/AKfycbwngjwLOwGx-PL_3I2sNv5L9emD9MuNGHcugdhsy5RS4RkO3y_5joLRjgwUJH5jPph6AA/exec";

  const options = {
    method: "GET",
  };

  try {
    const response = await Promise.race([
      fetch(url, options),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Request timed out"));
        }, 8000); // set timeout to 10 seconds
      }),
    ]);

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
}
