// For index.html
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    fetch('http://localhost:5000/api/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
.then(res => {
        if (!res.ok) throw new Error("Invalid login");
        return res.json();
    })
    .then(data => {
        localStorage.setItem("internEmail", data.email);
        window.location.href = "dashboard.html";
    })

    .catch(err => {
        console.error("Login error:", err);
        alert("Login failed. Please try again.");
    });
}




//sign up
function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("All fields are required.");
        return;
    }

    console.log("Sending signup data to backend:", { name, email, password });

    fetch('http://localhost:5000/api/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Signup failed");
        return res.json();
    })
    .then(data => {
        console.log("Signup successful from backend:", data);
        alert("Signup successful. You can now log in.");
        window.location.href = "index.html";
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Server error during signup.");
    });
}




// For dashboard.html
document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("dashboard.html")) return;

    const email = localStorage.getItem("internEmail");
    if (!email) {
        alert("Login first");
        window.location.href = "index.html";
        return;
    }

    fetch(`http://localhost:5000/api/intern/${email}`)
        .then(res => {
            if (!res.ok) throw new Error("Intern not found");
            return res.json();
        })
        .then(data => {
            document.getElementById("intern-name").textContent = data.name;
            document.getElementById("referral-code").textContent = data.referralCode;
            document.getElementById("donation-amount").textContent = data.totalDonations;
        })
        .catch(err => {
            console.error("Error loading dashboard:", err);
        });
});

//leaderboard
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes("leaderboard.html")) {
    fetch('http://localhost:5000/api/leaderboard')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched leaderboard data:", data);
        const tbody = document.getElementById("leaderboard-body");
        if (data.length === 0) {
          tbody.innerHTML = "<tr><td colspan='3'>No data available</td></tr>";
        } else {
          data.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${user.name}</td>
              <td>${user.referralCode}</td>
              <td>₹${user.totalDonations}</td>
            `;
            tbody.appendChild(row);
          });
        }
      })
      .catch(error => {
        console.error("Error loading leaderboard:", error);
      });
  }
});


//logout 
function logout() {
    localStorage.removeItem("internEmail");
    window.location.href = "index.html";
}




