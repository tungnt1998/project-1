const tableBodyElement = document.querySelector("#tbodySinhVien");
let currentCountSV = localStorage.getItem("msvCount")
  ? localStorage.getItem("msvCount")
  : 1;
const INPUT_TYPE = {
  NUMBER: "number",
  TEXT: "text",
  SELECT: "select",
};

// lay gia tri o input
const tenSvElement = document.querySelector("#txtTenSV");
const emailSvElement = document.querySelector("#txtEmail");
const passSvElement = document.querySelector("#txtPass");
const dobSvElement = document.querySelector("#txtNgaySinh");
const courseSvElement = document.querySelector("#khSV");
const diemToanSvElement = document.querySelector("#txtDiemToan");
const diemHoaSvElement = document.querySelector("#txtDiemHoa");
const diemLySvElement = document.querySelector("#txtDiemLy");
const listSV = localStorage.getItem("listSV")
  ? JSON.parse(localStorage.getItem("listSV"))
  : [];

let editId = "";
function buildSVTemplate(svObj) {
  const templateSv = document.querySelector("#templateSinhVien");
  const fragmentSv = templateSv.content.cloneNode(true);
  const svElement = fragmentSv.querySelector(".sinhVienRow");

  const msvElement = svElement.querySelector(".msv");
  msvElement.innerText = svObj.maSv;

  const tsvElement = svElement.querySelector(".tsv");
  tsvElement.innerText = svObj.tenSv;

  const emailElement = svElement.querySelector(".email");
  emailElement.innerText = svObj.email;

  const dobElement = svElement.querySelector(".dob");
  dobElement.innerText = svObj.ngaySinh;

  const courseElement = svElement.querySelector(".course");
  courseElement.innerText = svObj.khoaHoc === "1" ? "KH001" : "KH002";

  const dtbElement = svElement.querySelector(".dtb");
  const diemTb = (svObj.diemToan + svObj.diemLy + svObj.diemHoa) / 3;
  dtbElement.innerText = diemTb.toFixed(1);

  // remove btn
  const removeBtn = svElement.querySelector(".removeBtn");
  removeBtn.addEventListener("click", function () {
    // tim element tren html dua tren id
    tableBodyElement.removeChild(svElement);

    // tim vi tri cua phan tu
    const svIndex = listSV.findIndex((sv) => {
      return sv.maSv === svObj.maSv;
    });

    if (svIndex !== -1) {
      listSV.splice(svIndex, 1);
      localStorage.setItem("listSV", JSON.stringify(listSV));
    }
    // lay parent element remove child
  });

  //   edit button
  const editBtn = svElement.querySelector(".editBtn");
  editBtn.addEventListener("click", () => {
    tenSvElement.value = svObj.tenSv;
    emailSvElement.value = svObj.email;
    dobSvElement.value = svObj.ngaySinh;
    courseSvElement.value = svObj.khoaHoc;
    diemToanSvElement.value = svObj.diemToan;
    diemHoaSvElement.value = svObj.diemHoa;
    diemLySvElement.value = svObj.diemLy;
    editId = svObj.maSv;
    addSvBtn.innerText = "Sua thong tin";
  });

  // return html element
  return svElement;
}

for (const sinhVien of listSV) {
  const svElement = buildSVTemplate(sinhVien);

  tableBodyElement.appendChild(svElement);
}

const addSvBtn = document.querySelector("#addSvBtn");

addSvBtn.addEventListener("click", handleAddSv);

function handleAddSv(event) {
  event.preventDefault();

  // check dieu kien
  let isValid = true;

  const arrayInputs = [
    tenSvElement,
    emailSvElement,
    passSvElement,
    courseSvElement,
    diemToanSvElement,
    diemHoaSvElement,
    diemLySvElement,
  ];

  // neu dieu kien pass thi -> add
  for (const input of arrayInputs) {
    const inputType = input.getAttribute("data-inputType");
    const inputName = input.getAttribute("data-name");

    if (inputType === INPUT_TYPE.TEXT) {
      // validate for text input
      if (!input.value || input.value.length < 4) {
        input.nextElementSibling.style.display = "block";
        input.nextElementSibling.innerText = `${inputName} is not valid`;
        isValid = false;
      }
    }

    if (inputType === INPUT_TYPE.NUMBER) {
      //validate for number
    }

    if (inputType === INPUT_TYPE.SELECT) {
      // validate cho select
    }
  }

  // neu ko thi dung`
  if (!isValid) return;

  //   check is edit
  if (editId) {
    const editElement = listSV.find((sv) => {
      return sv.maSv === editId;
    });
    editElement.tenSv = tenSvElement.value;
    editElement.email = emailSvElement.value;
    editElement.khoaHoc = courseSvElement.value;
    editElement.diemHoa = Number(diemHoaSvElement.value);
    editElement.diemLy = Number(diemLySvElement.value);
    editElement.diemToan = Number(diemToanSvElement.value);
    editElement.ngaySinh = dobSvElement.value;
    tableBodyElement.innerHTML = "";
    for (const sinhVien of listSV) {
      const svElement = buildSVTemplate(sinhVien);

      tableBodyElement.appendChild(svElement);
    }
    localStorage.setItem("listSV", JSON.stringify(listSV));
    const formSV = document.querySelector("#addSvForm");
    formSV.reset();

    editId = "";
    return;
  }

  // add tao template dua tren data moi
  const newSinhVien = {
    tenSv: tenSvElement.value,
    maSv: "MSV-" + currentCountSV,
    email: emailSvElement.value,
    ngaySinh: dobSvElement.value,
    password: passSvElement.value,
    khoaHoc: courseSvElement.value,
    diemToan: Number(diemToanSvElement.value),
    diemLy: Number(diemLySvElement.value),
    diemHoa: Number(diemHoaSvElement.value),
  };
  // them vao localstorage
  listSV.push(newSinhVien);
  localStorage.setItem("listSV", JSON.stringify(listSV));

  // them vao vi tri can thiet
  const newSvElement = buildSVTemplate(newSinhVien);
  tableBodyElement.appendChild(newSvElement);
  // reset form
  const formSV = document.querySelector("#addSvForm");
  formSV.reset();

  // tang msv + 1
  currentCountSV++;
  localStorage.setItem("msvCount", currentCountSV);
}
