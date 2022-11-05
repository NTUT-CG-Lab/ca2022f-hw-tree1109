document.querySelector('.Leftpanel').addEventListener('change', e => {
  let val = parseFloat(e.target.value);
  let id = e.target.id;

  console.log(`[debug] id: %s, value: %f`, id, val);
  window.runModel(view => {
    //先傳到lapp delegate的view的參數
    //綁定參數
    if (id === 'ParamAngleX') view.angleX = val;
    if (id === 'ParamAngleY') view.angleY = val;
    if (id === 'ParamAngleZ') view.angleZ = val;
    if (id === 'ParamEyeLOpen') view.eyeLOpen = val;
    if (id === 'ParamEyeLSmile') view.eyeLSmile = val;
    if (id === 'ParamEyeROpen') view.eyeROpen = val;
    if (id === 'ParamEyeRSmile') view.eyeRSmile = val;
    if (id === 'ParamEyeBallX') view.eyeBallX = val;
    if (id === 'ParamEyeBallY') view.eyeBallY = val;
    view.eyeBallForm = 0;
    if (id === 'ParamBrowLY') view.browLY = val;
    if (id === 'ParamBrowRY') view.browRY = val;
    if (id === 'ParamBrowLX') view.browLX = val;
    if (id === 'ParamBrowRX') view.browRX = val;
    if (id === 'ParamBrowLAngle') view.browLAngle = val;
    if (id === 'ParamBrowRAngle') view.browRAngle = val;
    if (id === 'ParamBrowLForm') view.browLForm = val;
    if (id === 'ParamBrowRForm') view.browRForm = val;
    //mouth form
    if (id === 'ParamMouthForm') view.mouthForm = val;
    //mouth openY
    if (id === 'ParamMouthOpenY') view.mouthOpenY = val;
    if (id === 'ParamCheek') view.cheek = val;
    if (id === 'ParamBodyAngleX') view.bodyAngleX = val;
    if (id === 'ParamBodyAngleY') view.bodyAngleY = val;
    if (id === 'ParamBodyAngleZ') view.bodyAngleZ = val;
    if (id === 'ParamBreath') view.breath = val;
    // arm
    view.armLA = 0;
    view.armRA = 0;
    view.armLB = 0;
    view.armRB = 0;
    view.handL = 0;
    view.handR = 0;
    // hair
    if (id === 'ParamHairFront') view.hairFront = val;
    view.hairSide = 0;
    if (id === 'ParamHairBack') view.hairBack = val;
    view.hairFluffy = 0;
    view.shoulderY = 0;
    view.bustX = 0;
    view.bustY = 0;
    view.baseX = 0;
    view.baseY = 0;
  });
});

document.querySelector('.Rightpanel').addEventListener('change', e => {
  let val = parseFloat(e.target.value);
  let id = e.target.id;
  let type = e.target.type;

  if (type === 'range') {
    console.log(`[debug] id: %s, value: %f`, id, val);

    window.runModel(view => {
      // [SPECIAL PARAM]
      view.specialList.set(id, val);
    });
  }
});

// 參數 上下限
document.querySelectorAll('.Boundary').forEach(element => {
  element.addEventListener('change', e => {
    let val = e.target.value;
    let classList = e.target.classList;
    let slider;

    if (classList.contains('Standard'))
      slider = document.querySelector('.Standard > input');
    if (classList.contains('Specific'))
      slider = document.querySelector('.Specific > input');

    if (classList.contains('Minimum')) slider.setAttribute('min', val);
    if (classList.contains('Maximum')) slider.setAttribute('max', val);
  });
});

// 標準參數
document.querySelector('#StandardParameterDropdown').addEventListener('change', e => {
  let val = e.target.value;
  let el;

  // update label
  el = document.querySelector('.Standard > h4');
  el.innerHTML = val;

  // update slider
  el = document.querySelector('.Standard > input');
  el.setAttribute('id', val);
});

// 特定參數
document.querySelector('#SpecificParameterDropdown').addEventListener('change', e => {
  let val = e.target.value;
  let el;

  // update label
  el = document.querySelector('.Specific > h4');
  el.innerHTML = val;

  // update slider
  el = document.querySelector('.Specific > input');
  el.setAttribute('id', val);
});

// 載入 JSON 檔案並更新 dropdown options
document.querySelector('#importedJson').addEventListener('change', e => {
  let jsonFile = e.target.files[0];
  let reader = new FileReader();

  // JSON檔案讀取完成後執行
  reader.onload = () => {
    let json = reader.result;
    let paramObjs = JSON.parse(json).Parameters;
    let el;

    // 標準參數
    let stdParams = ["ParamAngleX", "ParamAngleY", "ParamAngleZ", "ParamEyeLOpen", "ParamEyeLSmile", "ParamEyeROpen",
      "ParamEyeRSmile", "ParamEyeBallX", "ParamEyeBallY", "ParamEyeBallForm", "ParamBrowLY", "ParamBrowRY",
      "ParamBrowLX", "ParamBrowRX", "ParamBrowLAngle", "ParamBrowRAngle", "ParamBrowLForm", "ParamBrowRForm",
      "ParamMouthForm", "ParamMouthOpenY", "ParamCheek", "ParamBodyAngleX", "ParamBodyAngleY", "ParamBodyAngleZ",
      "ParamBreath", "ParamArmLA", "ParamArmRA", "ParamArmLB", "ParamArmRB", "ParamHandL", "ParamHandR",
      "ParamHairFront", "ParamHairSide", "ParamHairBack", "ParamHairFluffy", "ParamShoulderY", "ParamBustX",
      "ParamBustY", "ParamBaseX", "ParamBaseY"];

    // 模型參數
    let modelStdParams = [];
    let modelSpcParams = [];

    // 載入模型參數並分類
    for (let i = 0; i < paramObjs.length; i++) {
      let paramId = paramObjs[i].Id;
      if (stdParams.includes(paramId)) {
        modelStdParams.push(paramId);
      } else {
        modelSpcParams.push(paramId);
      }
    }

    // 更新 Standard Dropdown Options
    el = document.querySelector('#StandardParameterDropdown')
    el.innerHTML = ``
    for (let i = 0; i < modelStdParams.length; i++) {
      el.innerHTML += `<option value="` + modelStdParams[i] + `">` + modelStdParams[i] + `</option>`;
    }

    // 更新 Specific Dropdown Options
    el = document.querySelector('#SpecificParameterDropdown')
    el.innerHTML = ``
    for (let i = 0; i < modelSpcParams.length; i++) {
      el.innerHTML += `<option value="` + modelSpcParams[i] + `">` + modelSpcParams[i] + `</option>`;
    }

    // 基本初始化
    // Standard
    el = document.querySelector('.Standard > h4');
    el.innerHTML = modelStdParams[0];
    el = document.querySelector('.Standard > input');
    el.setAttribute('id', modelStdParams[0]);
    el.setAttribute('min', '-30');
    el.setAttribute('max', '30');
    el.value = '0';
    el = document.querySelector('.Standard .Minimum');
    el.value = '-30';
    el = document.querySelector('.Standard .Maximum');
    el.value = '30';
    // Specific
    el = document.querySelector('.Specific > h4');
    el.innerHTML = modelSpcParams[0];
    el = document.querySelector('.Specific > input');
    el.setAttribute('id', modelSpcParams[0]);
    el.setAttribute('min', '-30');
    el.setAttribute('max', '30');
    el.value = '0';
    el = document.querySelector('.Specific .Minimum');
    el.value = '-30';
    el = document.querySelector('.Specific .Maximum');
    el.value = '30';
  };

  // 讀取JSON檔案
  reader.readAsText(jsonFile);
});
