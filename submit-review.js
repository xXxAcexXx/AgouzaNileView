// Review submission form
document.getElementById("submit-review").addEventListener("submit", function(event) {
    event.preventDefault();

    // Retrieve form values
    const name = document.getElementById("name").value;
    const country = document.getElementById("country").value;
    const message = document.getElementById("message").value;
    const rating = document.getElementById("rating").value;

    // Handle review submission logic here
    alert("Review submitted. Awaiting approval.");
});
