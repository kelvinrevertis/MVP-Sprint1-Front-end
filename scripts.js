const getList = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/treinos");
    const data = await response.json();
    const options = data.map((item) => ({
      value: item.id,
      label: item.nome,
    }));
    data.forEach((item) => insertList(item.nome, item.quantidade, item.id));
  } catch (error) {
    console.error("Error:", error);
  }
};

getList();

const postTraining = async (inputTraining, inputQuantity) => {
  const data = { nome: inputTraining, quantidade: inputQuantity };
  console.log(inputTraining);
  let url = "http://127.0.0.1:5000/treinos";

  try {
    const response = await fetch(url);
    const treinos = await response.json();

    // Verifica se já existe um treino com o mesmo nome
    const treinoExistente = treinos.find((treino) => treino.nome === inputTraining);

    if (treinoExistente) {
      const updatedData = { ...data, quantidade: Number(data.quantidade) + Number(treinoExistente.quantidade) };

      url = `${url}/${treinoExistente.id}`;

      fetch(url, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  } catch (error) {
    console.error("Error:", error);
  }
  window.location.reload();
};

const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
};

const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let row = this.parentElement.parentElement;
      const idTraining = row.dataset.id;
      if (confirm("Você tem certeza?")) {
        row.remove();
        deleteItem(idTraining);
        alert("Removido!");
      }
    };
  }
};

const deleteItem = (id) => {
  let url = `http://127.0.0.1:5000/treinos/${id}`;
  fetch(url, {
    method: "delete",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao excluir treino");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Ocorreu um erro ao tentar excluir o item. Por favor, tente novamente mais tarde.");
    });
};

const newTraining = async () => {
  let inputTraining = document.getElementById("trainingName").value;
  let inputQuantity = document.getElementById("trainingQuantity").value;

  if (inputTraining === "") {
    alert("Escreva o nome do exercicio!");
  } else if (isNaN(inputQuantity)) {
    alert("Quantidade do treino precisa ser em números!");
  } else {
    insertList(inputTraining, inputQuantity);
    await postTraining(inputTraining, inputQuantity);
    alert("Exercício adicionado!");
  }
};

const insertList = (name, quantity, id) => {
  var training = [name, quantity];
  var table = document.getElementById("myTraining");
  var row = table.insertRow();

  if (id) {
    row.dataset.id = id;
  }

  for (var i = 0; i < training.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = training[i];
  }

  insertButton(row.insertCell(-1));
  document.getElementById("trainingName").value = "";
  document.getElementById("trainingQuantity").value = "";

  removeElement();
};

const insertSelect = (trainings) => {
  var select = document.getElementById("selectTraining");

  trainings.forEach((training) => {
    var option = document.createElement("option");
    option.value = training.id; // Adiciona o ID do treino como valor da opção
    option.text = training.nome;
    select.add(option);
  });
};

fetch("http://127.0.0.1:5000/treinos")
  .then((response) => response.json())
  .then((data) => {
    insertSelect(data);
  });

  async function confirmRealizedTraining() {
    const select = document.getElementById("selectTraining");
    const selectedId = select.options[select.selectedIndex].value;
    const realized = Number(document.getElementById("realizedTraning").value);

    let url = `http://127.0.0.1:5000/treinos`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao recuperar o treino");
      }
      url = `http://127.0.0.1:5000/treino/${selectedId}`;

      const treinos = await response.json();
      const treino = treinos.find((t) => t.id == selectedId);
      console.log(treino);

      // Define a nova quantidade como o valor realizado
      const novaQuantidade = realized;

      // Envia um pedido PATCH para a API com o novo valor da quantidade do treino
      const patchResponse = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantidade: novaQuantidade }),
      });
      if (!patchResponse.ok) {
        throw new Error("Erro ao editar treino");
      }
      const data = await patchResponse.json();
      console.log(data);
      alert("Treino atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao tentar recuperar ou atualizar o treino. Por favor, tente novamente mais tarde.");
    }
    window.location.reload();
  }

const confirmBtn = document.getElementById("confirm-btn");
confirmBtn.addEventListener("click", confirmRealizedTraining);

const realizedInput = document.getElementById("realizedTraning");
const realizedQuantity = realizedInput ? Number(realizedInput.value) : 0;
console.log(realizedQuantity);

//Botão "?"
const openQuestionButton = document.querySelector("#open-question-modal");
const closeQuestionButton = document.querySelector("#close-question-modal");
const question = document.querySelector("#question");
const hide = document.querySelector("#hide");

const toggleQuestion = () => {
  question.classList.toggle("hide");
  hide.classList.toggle("hide");
};

[openQuestionButton, closeQuestionButton, hide].forEach((el) => {
  el.addEventListener("click", () => toggleQuestion());
});


//Botão "Realizado"
const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};

[openModalButton, closeModalButton, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});


