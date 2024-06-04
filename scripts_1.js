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

    function typeWriter(text, element, callback) {
        let i = 0;
        const placeholder = '|';
        function typing() {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + placeholder;
                i++;
                setTimeout(typing, 100);
            } else {
                element.innerHTML = text;
                if (callback) callback();
            }
        }
        typing();
    }

    function displayIntroductionLines() {
        showContainer(introContainers[0], config.introMessages[0], () => {
            showContainer(introContainers[1], config.introMessages[1], () => {
                showContainer(introContainers[2], config.introMessages[2], () => {
                    setTimeout(showAnimation, 2000);
                });
            });
        });
    }

    function showContainer(container, text, callback) {
        container.classList.add('active');
        typeWriter(text, container.querySelector('p'), () => {
            setTimeout(() => {
                container.classList.remove('active');
                container.style.display = 'none';
                if (callback) callback();
            }, 2000);
        });
    }

    function showAnimation() {
        animationContainer.style.display = 'flex';
        createFallingEmojis(emojiList, 50);
        animationContainer.classList.add('active');
        setTimeout(showWheel, 2000);
    }

    function createFallingEmojis(emojis, count) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const emoji = document.createElement('div');
            emoji.classList.add('falling-emojis');
            emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + 'vw';
            emoji.style.animationDuration = Math.random() * 2 + 3 + 's';
            fragment.appendChild(emoji);
        }
        animationContainer.appendChild(fragment);
    }

    function showWheel() {
        animationContainer.classList.remove('active');
        setTimeout(() => {
            animationContainer.style.display = 'none';
            wheelContainer.style.display = 'flex';
            wheelContainer.classList.add('active');
        }, 1000);
    }

    const prizes = Object.keys(prizeMapping);
    const myLucky = new LuckyCanvas.LuckyWheel('#my-lucky', {
        width: 300,
        height: 300,
        blocks: [{ padding: '10px', background: '#617df2' }],
        prizes: prizes.map((prize, index) => ({
            background: index % 2 === 0 ? '#e9e8fe' : '#b8c5f2',
            fonts: [{ text: prize }]
        })),
        buttons: [{ radius: '30%', background: '#869cfa', pointer: true }]
    });

    window.startGame = function() {
        if (isPlaying) return;
        isPlaying = true;
        myLucky.play();
        setTimeout(() => {
            const prizeIndex = Math.floor(Math.random() * prizes.length);
            myLucky.stop(prizeIndex);
            showPrize(prizes[prizeIndex]);
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