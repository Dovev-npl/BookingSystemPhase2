
// ===============================
// Form handling for resources page
// ===============================

// -------------- Helpers --------------
function $(id) {
  return document.getElementById(id);
}

function logSection(title, data) {
  console.group(title);
  console.log(data);
  console.groupEnd();
}

function getSelectedPriceUnit() {
  const checked = document.querySelector('input[name="resourcePriceUnit"]:checked');
  return checked ? checked.value : "";
}

function isResourceNameValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[A-Za-z0-9 ]+$/;
  return trimmed.length >= 5 && trimmed.length <=30 && allowedPattern.text(trimmed);
}

function isResourceDescriptionValid(value){
  const trimmed = value.trim();
  const allowedPattern = /^[A-Za-z0-9 ]+$/;
  return trimmed.length >= 10 && trimmed.length <= 50 && allowedPattern.text(trimmed);
}
// -------------- Form wiring --------------
document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (!form) {
    console.warn("resourceForm not found. Ensure the form has id=\"resourceForm\".");
    return;
  }

  form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const actionValue = submitter && submitter.value ? submitter.value : "create";
  const resourceName = $("resourceName")?.value.trim() ?? "";
  const resourceDescription = $("resourceDescription")?.value.trim() ?? "";
  const resourceAvailable = $("resourceAvailable")?.checked ?? false;
  const resourcePrice = $("resourcePrice")?.value ?? "";
  const resourcePriceUnit = getSelectedPriceUnit();

  const nameValid = isResourceNameValid(resourceName);
  const descriptionValid = isResourceDescriptionValid(resourceDescription);
 
  if (!nameValid || !descriptionValid) {
	console.warn("Invalid input. Request was not sent.");
	return;
}
  const payload = {
    action: actionValue,
    resourceName,
    resourceDescription,
    resourceAvailable,
    resourcePrice,
    resourcePriceUnit
  };

  logSection("Sending payload to httpbin.org/post", payload);

  try {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}\n${text}`);
    }

    const data = await response.json();

    console.group("Response from httpbin.org");
    console.log("Status:", response.status);
    console.log("URL:", data.url);
    console.log("You sent (echo):", data.json);
    console.log("Headers (echoed):", data.headers);
    console.groupEnd();

  } catch (err) {
    console.error("POST error:", err);
  }
}
