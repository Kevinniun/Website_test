// ========== 节点定义 ==========
const nodes = {
  5382: { img: "assets/images/exhibit/IMG_5382.jpg", next: 5383 },
  5383: {img: "assets/images/exhibit/IMG_5383.jpg",next: 5384, back: 5382},
  5384: { img: "assets/images/exhibit/IMG_5384.jpg", back: 5382, next: 5386},
  5386: { img: "assets/images/exhibit/IMG_5386.jpg", back: 5384, right: 5387},
  5387: { img: "assets/images/exhibit/IMG_5387.jpg", left: 5386, right: 5388},
  5388: { img: "assets/images/exhibit/IMG_5388.jpg", left: 5387, next: 5389},
  5389: { img: "assets/images/exhibit/IMG_5389.jpg", back: 5388, left: 5390, right: 5391,
    gallery: [
      "assets/images/exhibit/IMG_5392.jpg",
      "assets/images/exhibit/IMG_5393.jpg",
      "assets/images/exhibit/IMG_5395.jpg",
    ]
  },
  5391: { img: "assets/images/exhibit/IMG_5391.jpg", left: 5389, next: 5394},
  5394: { img: "assets/images/exhibit/IMG_5394.jpg", back: 5391},

  5390: { img: "assets/images/exhibit/IMG_5390.jpg", right: 5389, next: 5398},
};

// 当前节点
let current = 5382;
const img = document.getElementById("exhibit-img");

// 四向按钮
const btnNext = document.getElementById("btn-next");
const btnBack = document.getElementById("btn-back");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

// 展品按钮 & Overlay
const btnGallery = document.getElementById("btn-gallery");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryImages = document.getElementById("gallery-images");
const closeGallery = document.getElementById("close-gallery");

// ========== 切换主节点 ==========
function goToNode(targetId) {
  if (!nodes[targetId]) return;
  current = targetId;
  img.style.opacity = 0;
  setTimeout(() => {
    img.src = nodes[current].img;
    img.style.opacity = 1;
    updateButtons();
  }, 400);
}

// ========== 更新按钮显示状态 ==========
function updateButtons() {
  btnNext.style.display = nodes[current].next ? "block" : "none";
  btnBack.style.display = nodes[current].back ? "block" : "none";
  btnLeft.style.display = nodes[current].left ? "block" : "none";
  btnRight.style.display = nodes[current].right ? "block" : "none";
  btnGallery.style.display = nodes[current].gallery ? "block" : "none";

  if (current === 5382) {
    btnNext.textContent = "开始云参观";
    btnNext.classList.add("start-btn");
  } else {
    btnNext.textContent = "↑";
    btnNext.classList.remove("start-btn");
  }
}

// ========== 展品一览逻辑 ==========
btnGallery.addEventListener("click", () => {
  const galleryList = nodes[current].gallery;
  if (!galleryList) return;

  // 清空旧内容
  galleryImages.innerHTML = "";

  // 生成图片缩略图
  galleryList.forEach(src => {
    const imgEl = document.createElement("img");
    imgEl.src = src;
    galleryImages.appendChild(imgEl);
  });

  // 显示 overlay
  galleryOverlay.style.display = "flex";
});

// 关闭展品一览
closeGallery.addEventListener("click", () => {
  galleryOverlay.style.display = "none";
});

// ========== 四向移动绑定 ==========
btnNext.addEventListener("click", () => goToNode(nodes[current].next));
btnBack.addEventListener("click", () => goToNode(nodes[current].back));
btnLeft.addEventListener("click", () => goToNode(nodes[current].left));
btnRight.addEventListener("click", () => goToNode(nodes[current].right));

// 初始化
updateButtons();

// ========== 点击展品放大功能 ==========

// 获取放大层元素
const imageZoom = document.getElementById("image-zoom");
const zoomedImg = document.getElementById("zoomed-img");

// 在展示展品一览时，为每个缩略图绑定点击事件
btnGallery.addEventListener("click", () => {
  const galleryList = nodes[current].gallery;
  if (!galleryList) return;

  galleryImages.innerHTML = "";

  galleryList.forEach(src => {
    const imgEl = document.createElement("img");
    imgEl.src = src;

    // ✅ 点击缩略图 → 打开放大层
    imgEl.addEventListener("click", () => {
      zoomedImg.src = src;
      imageZoom.style.display = "flex";
    });

    galleryImages.appendChild(imgEl);
  });

  galleryOverlay.style.display = "flex";
});

// 点击放大层任意处 → 关闭
imageZoom.addEventListener("click", () => {
  imageZoom.style.display = "none";
});

// // ===========================
// // 语音导览 - 四种语言播放
// // ===========================

// const audioBtn = document.getElementById("btn-audio");
// const audioOverlay = document.getElementById("audio-overlay");
// const closeAudio = document.getElementById("close-audio");
// const audioOptions = document.querySelectorAll(".audio-option");
// const guidePlayer = document.getElementById("guide-player");

// // 打开面板
// audioBtn.addEventListener("click", () => {
//   audioOverlay.style.display = "flex";
// });

// // 关闭面板
// closeAudio.addEventListener("click", () => {
//   guidePlayer.pause();
//   audioOverlay.style.display = "none";
// });

// // 点击选择语言
// audioOptions.forEach(option => {
//   option.addEventListener("click", () => {
//     const file = option.dataset.audio;
//     guidePlayer.src = `assets/sounds/${file}`;
//     guidePlayer.play();
//   });
// });

// ===========================
// 语音导览系统（最终稳定版）
// ===========================

const audioBtn = document.getElementById("btn-audio");
const audioOverlay = document.getElementById("audio-overlay");
const closeAudio = document.getElementById("close-audio");
const audioOptions = document.querySelectorAll(".audio-option");
const guidePlayer = document.getElementById("guide-player");

// 打开语音菜单（不影响播放）
audioBtn.addEventListener("click", () => {
  audioOverlay.style.display = "flex";
});

// 关闭语音菜单（不停止播放）
closeAudio.addEventListener("click", () => {
  audioOverlay.style.display = "none";
});

// 点击语言播放语音
audioOptions.forEach(option => {
  option.addEventListener("click", () => {
    const file = option.dataset.audio;
    const path = `assets/sounds/${file}`;

    // 如果选择相同语言，不重新加载音频
    if (guidePlayer.src.endsWith(file)) {
      if (guidePlayer.paused) guidePlayer.play();
      return;
    }

    // 切换音频
    guidePlayer.src = path;
    guidePlayer.play();
  });
});
