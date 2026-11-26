// University Management System - JavaScript enhancements
document.addEventListener("DOMContentLoaded", () => {
  // Highlight the current page in the navigation bar.
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(link => {
    const target = link.getAttribute("href");
    if (target === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Display the current date and time in the footer.
  const footer = document.querySelector("footer");
  if (footer) {
    let clock = document.getElementById("ums-clock");
    if (!clock) {
      clock = document.createElement("span");
      clock.id = "ums-clock";
      clock.className = "ums-clock";
      footer.appendChild(clock);
    }
    const updateClock = () => {
      clock.textContent = new Date().toLocaleString("en-IN", {
        dateStyle: "medium", timeStyle: "medium"
      });
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Add one live-search box for cards and/or data tables on the current page.
  const main = document.querySelector("main");
  if (main) {
    const cards = [...main.querySelectorAll(".card-container .card, .card-container .student-card")];
    const tables = [...main.querySelectorAll("table")];
    if (cards.length || tables.length) {
      const wrapper = document.createElement("div");
      wrapper.className = "ums-search-wrap";
      const search = document.createElement("input");
      search.type = "search";
      search.className = "ums-search";
      search.placeholder = "Search this page...";
      search.setAttribute("aria-label", "Search records on this page");
      wrapper.appendChild(search);

      const firstHeading = main.querySelector("h2");
      if (firstHeading) firstHeading.insertAdjacentElement("afterend", wrapper);
      else main.prepend(wrapper);

      search.addEventListener("input", () => {
        const query = search.value.trim().toLowerCase();
        cards.forEach(card => {
          card.hidden = !card.textContent.toLowerCase().includes(query);
        });
        tables.forEach(table => {
          table.querySelectorAll("tr").forEach((row, index) => {
            if (index === 0) return; // Keep the table heading visible.
            row.hidden = !row.textContent.toLowerCase().includes(query);
          });
        });
      });
    }
  }

  // Make dashboard cards navigate to their corresponding sections.
  if (currentPage === "index.html") {
    const destinations = [
      "student.html", "faculty.html", "department.html",
      "timetable.html", "notices.html"
    ];
    document.querySelectorAll("main .card-container .card").forEach((card, index) => {
      if (destinations[index]) {
        card.classList.add("clickable-card");
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Open ${card.querySelector("h3")?.textContent || "section"}`);
        const navigate = () => { location.href = destinations[index]; };
        card.addEventListener("click", navigate);
        card.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate();
          }
        });
      }
    });
  }
});
