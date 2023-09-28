const getBMI = async () => {
  try {
    const response = await fetch(`${baseUrl}/bmi`);
    const data = await response.json();
    if (data && data.bmi) {
      const bmiValueElement = document.getElementById("bmiValue");
      bmiValueElement.textContent = data.bmi.toFixed(2);
      const rangeValueElement = document.getElementById("imc-range");
      rangeValueElement.textContent = data.healthy_bmi_range;
    }
  } catch (error) {
    alert("Error:", error);
  }
};

getBMI();

const openCalculateButton = document.querySelector("#open-calculate-modal");
const closeCalculateButton = document.querySelector("#close-calculate-modal");
const calculate = document.querySelector("#calculate");

const toggleCalculator = () => {
  calculate.classList.toggle("hide");
};

[openCalculateButton, closeCalculateButton].forEach((el) => {
  el.addEventListener("click", () => toggleCalculator());
});

const updateBMI = (bmi) => {
  const bodyBMIInput = document.getElementById("bodyBMI");
  bodyBMIInput.value = bmi.toFixed(2);
};

const calculateBMI = async () => {
  const inputAge = parseFloat(document.getElementById("bodyAge").value);
  const inputWeight = parseFloat(document.getElementById("bodyWeight").value);
  const inputHeight = parseFloat(document.getElementById("bodyHeight").value);
  const bodyBMIInput = document.getElementById("bodyBMI");
  const bmiValue = document.getElementById("bmiValue");

  switch (true) {
    case isNaN(inputAge) || isNaN(inputWeight) || isNaN(inputHeight):
      alert("Preencha os campos com valores numéricos válidos.");
      return;
    case inputAge < 0 || inputAge > 80:
      alert("A idade não pode ser negativa ou acima de 80.");
      return;
    case inputWeight < 40 || inputWeight > 160:
      alert("O peso deve estar entre 40 kg e 160 kg.");
      return;
    case inputHeight < 130 || inputHeight > 230:
      alert("A altura deve estar entre 130 cm e 230 cm.");
      return;
    default:
      const url = `https://fitness-calculator.p.rapidapi.com/bmi?age=${inputAge}&weight=${inputWeight}&height=${inputHeight}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "51b6280828msh52f63d17e1474cdp1e0e29jsn2bf3614588ad",
          "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const jsonResponse = await response.json();
        const bmi = jsonResponse.data.bmi;
        const health = jsonResponse.data.health;
        const healthyBmiRange = jsonResponse.data.healthy_bmi_range;

        console.log("BMI:", bmi);
        await sendBMItoAPI(bmi, health, healthyBmiRange);
        bodyBMIInput.value = bmi;
      } catch (error) {
        console.error(error);
      }
  }
  window.location.reload();
};

const sendBMItoAPI = async (bmi, health, healthyBmiRange) => {
  const url = `${baseUrl}/bmi`;
  const data = {
    bmi,
    health,
    healthy_bmi_range: healthyBmiRange,
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    console.log("Resultado atualizado na API:", response);
  } catch (error) {
    console.error("Erro ao atualizar resultado na API:", error);
  }
};
