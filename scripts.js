document.addEventListener('DOMContentLoaded', () => {
    const introContainers = [
        document.getElementById('introContainer1'),
        document.getElementById('introContainer2'),
        document.getElementById('introContainer3')
    ];
    const animationContainer = document.getElementById('animationContainer');
    const wheelContainer = document.getElementById('wheelContainer');
    const startButton = document.getElementById('startButton');
    const emojiList = config.emojiList;
    const prizeMapping = config.prizes;
    const contactPerson = config.contactPerson;
    let isPlaying = false;

    // 初始化奖品映射
    const prizeMappingElement = document.getElementById('prizeMapping');
    Object.entries(prizeMapping).forEach(([key, { description, icon }], index) => {
        const prizeCard = document.createElement('div');
        prizeCard.classList.add('prize-card');

        const prizeIcon = document.createElement('div');
        prizeIcon.classList.add('prize-icon');
        prizeIcon.innerText = icon;

        const prizeDescription = document.createElement('div');
        prizeDescription.classList.add('prize-description');
        prizeDescription.innerText = description;

        const watermark = document.createElement('div');
        watermark.classList.add('watermark');
        watermark.innerText = index + 1; // 奖项顺序，从1开始

        prizeCard.appendChild(prizeIcon);
        prizeCard.appendChild(prizeDescription);
        prizeCard.appendChild(watermark); // 添加水印到奖项卡片

        prizeMappingElement.appendChild(prizeCard);
    });

    // 修改抽奖项，确保第二个奖项被选中
    const prizes = Object.keys(prizeMapping);
    const secondPrizeIndex = 1; // 第二个奖项索引为1（数组索引从0开始）
    const myLucky = new LuckyCanvas.LuckyWheel('#my-lucky', {
        width: 300,
        height: 300,
        blocks: [{ padding: '10px', background: '#617df2' }],
        prizes: prizes.map((prize, index) => ({
            background: index === secondPrizeIndex ? '#ff0000' : (index % 2 === 0 ? '#e9e8fe' : '#b8c5f2'),
            fonts: [{ text: prize }]
        })),
        buttons: [{ radius: '30%', background: '#869cfa', pointer: true }]
    });

    window.startGame = function() {
        if (isPlaying) return;
        isPlaying = true;
        myLucky.play();
        setTimeout(() => {
            myLucky.stop(secondPrizeIndex); // 确保抽中第二个奖项
            showPrize(prizes[secondPrizeIndex]);
        }, 3000);
    }

    function showPrize(prize) {
        const prizeText = prizeMapping[prize].description;
        const message = `恭喜你抽中了奖品：${prizeText}，请找${contactPerson}兑换。`;
        logPrize(prizeText, message).then(() => {
            isPlaying = false;
        });
    }

    async function logPrize(prizeText, message) {
        const now = new Date();
        const logEntry = { time: now.toISOString(), prize: prizeText, notification: message };
        let prizeLog = JSON.parse(localStorage.getItem('prizeLog')) || [];
        prizeLog.push(logEntry);
        localStorage.setItem('prizeLog', JSON.stringify(prizeLog));
    }

    displayIntroductionLines();
});