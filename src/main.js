document.getElementById("emailForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const emailValue = document.getElementById("email").value.trim();
  const errorMessage = document.getElementById("error-message");

  try {
    const response = await fetch("/api/validate-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: emailValue })
    });

    const result = await response.json();

    if (result.success) {
      errorMessage.textContent = "";
      // Redirect the user to the URL provided by the server
      window.location.href = result.redirectURL;
    } else {
      errorMessage.textContent = result.message || "Your email is not authorized. Please contact support.";
    }
  } catch (error) {
    console.error("Error validating email:", error);
    errorMessage.textContent = "An error occurred. Please try again later.";
  }
});
