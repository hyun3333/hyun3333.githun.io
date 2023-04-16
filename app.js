// 시작을 눌렀을 때 메인화면 제거 이벤트
const $start = document.getElementById('start');
const $startBtn = document.getElementById('start-btn');
const $gameOn = document.getElementById('gameOn');

$gameOn.style.display = 'none';

$startBtn.addEventListener('click', e => {
    $start.classList.toggle('hide');
    $gameOn.style.display = 'flex';
    $gameOn.style.opacity = '0';
    setTimeout(e =>{
        $start.style.transition = '1s';
        $gameOn.style.transition = '0.5s';
        $gameOn.style.opacity = '1';
    }, 400)
})


// 포카드
const gameData = {
    card: Math.floor(Math.random() * 40) + 1,
    dealCard: 0, // 딜러 카드의 총합
    myCard: 0, // 내 카드의 총합
    myMoney: 500, // 내 현재 금액
    myBetting: 0, // 내 배팅 합계
    myScore: 0 // 나의 점수
}


const $playerUl = document.getElementById('player-card');
const $dealerUl = document.getElementById('dealer-card');
let standFlag = false; //내 카드인지 딜러의 카드인지 여부
// 카드 뽑기 함수 (40개 중 랜덤) 
let cardNum = 0;
let rCard = [];
function randomCard() {
    if(rCard.length>=38){ //카드를 다 쓰면 셔플하기.
        console.log('카드를 다시 셔플합니다.')
        rCard.splice(0);
    }

    let random = Math.floor(Math.random() * 40) + 1;
    while (rCard.includes(random)) {
        random = Math.floor(Math.random() * 40) + 1;
        if (random == 0) continue;
    }
    rCard.push(random);
    cardNum = random;

    if (random <= 10) { //결과에 따라 - 진행
    } else if (random <= 20) {
        cardNum -= 10;
    } else if (random <= 30) {
        cardNum -= 20;
    } else if (random <= 40) {
        cardNum -= 30;
    };

    const $randomCardImg = document.createElement('li');
    $randomCardImg.style.backgroundImage = 'url(./img/1-40card/'+random+'.png)'
    if(!standFlag){
        $playerUl.appendChild($randomCardImg);
    } else{
        $dealerUl.appendChild($randomCardImg);
    }
    
    return cardNum;
}



let $betting = document.querySelector('#betting')
let $betMoney = document.getElementById('betting-text-money');
let $poMoney = document.getElementById('pocket-text-money');

// 배팅 실시간 설정
let bett = 0;
$betting.addEventListener('click', e => {
    if (!e.target.matches('input')) return;
    if (e.target.value === 'All-in'){ //헤헤
        console.log('올인선택');
        bett = gameData.myMoney;
    } else{
        bett = e.target.value;
    }
    if (bett > gameData.myMoney) return;

    gameData.myBetting += (+bett);
    gameData.myMoney -= (+bett);
    $betMoney.textContent = gameData.myBetting;
    $poMoney.textContent = gameData.myMoney;
})


let $shuffleBtn = document.getElementById('shuffleBtn');
const $shuffleText = document.getElementById('shuff-text');
const $shuffle = document.querySelector('.blackJack');
let $myPoint = document.querySelector('#myCard-sum > h3');
let $youPoint = document.querySelector('#youCard-sum > h3');
const $hitStand = document.querySelector('#card-sum')

let flag = false;
// 셔플 진행!!
$shuffleBtn.addEventListener('click', e => {
    console.log('셔플진행버튼');
    if (gameData.myBetting === 0) {
        $shuffleText.classList.add('shake'); //배팅금액을 확인해주세요 반복
        if($shuffleText.classList.contains('shake')) {
            $shuffleText.classList.remove('shake');
            $shuffleText.offsetWidth;
            $shuffleText.classList.add('shake');
        }
        return;
    } else if (flag) {
        return;
    }

    $betting.classList.add('hide')
    gameData.myCard += (+randomCard());
    gameData.myCard += (+randomCard());
    $myPoint.textContent = gameData.myCard;
    
    standFlag = true;
    gameData.dealCard += (+randomCard());
    $youPoint.textContent = gameData.dealCard;
    standFlag = false;

    $shuffle.style.display = 'none';
    $shuffleText.classList.remove('shake');
    $hitStand.classList.add('on');
    flag = true;

})



const $hitBtn = document.getElementById('hitBtn');
const $standBtn = document.getElementById('standBtn');

// hit를 눌러서 게임 진행하는 함수
$hitBtn.addEventListener('click', e => {
    if (gameData.myCard === 0) {
        alert('셔플부터 진행해주세요.')
        return;
    } else if (gameData.myCard > 21) {
        return;
    }
    $addScore.style.color = 'rgb(255, 187, 0)';
    let hitCard = randomCard();
    gameData.myCard += (+hitCard); //내 카드의 총합 더하기
    $myPoint.textContent = gameData.myCard;

    if (gameData.myCard > 21) {
        setTimeout(e=>{
            alert('21 초과! \n딜러의 승리입니다.')
            roundLose()
            loseCheck();
            roundReset();
            return;
        }, 800)
    }
})


// stand를 눌러서 딜러의 차례가 시작되는 함수
const $endgame = document.querySelector('#end')
const $gameScoreIng = document.getElementById('gameOn-score');
const $addMoney = document.getElementById('addMoney');
const $addMoneyEm = document.querySelector('#addMoney>em');
const $addScore = document.getElementById('addScore');
const $addScoreEm = document.querySelector('#addScore>em');

$standBtn.addEventListener('click', e => {
    if (gameData.myCard === 0) { return; //카드를 안뽑고 멈추면 안됨.
    } else if(gameData.myCard > 21) return;
    if(standFlag) return;
    
    standFlag = true;
    let func = setInterval(() => {

        let standCard = randomCard();
        gameData.dealCard += (+standCard);

        $youPoint.textContent = gameData.dealCard
        if (gameData.dealCard >= 17) {
            setTimeout(e=>{
                if (gameData.dealCard > 21 || gameData.dealCard < gameData.myCard) {
                    $poMoney.textContent = gameData.myMoney + gameData.myBetting * 2;
                    gameData.myMoney += gameData.myBetting * 2;
                    
                    gameData.myScore += gameData.myBetting*10;
                    $gameScoreIng.textContent = gameData.myScore;
                    $addScoreEm.textContent = '+ '+gameData.myBetting*10;
                    $addScore.classList.add('win') //스코어 올라감

                    $addMoneyEm.textContent = gameData.myBetting*2;
                    $addMoney.classList.add('win') //소지금 올라감

                    alert('Dealer: ▮'+gameData.dealCard+'  Player: ▮'+gameData.myCard
                    +'\n⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊\n플레이어의 승리입니다!.')
                    
                } else if (gameData.dealCard > gameData.myCard) {
                    alert('Dealer: ▮'+gameData.dealCard+'  Player: ▮'+gameData.myCard
                    +'\n⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊⚊\n딜러의 승리입니다.')
                    roundLose()
    
                } else if (gameData.dealCard === gameData.myCard) {
                    alert(gameData.myCard+'점 동점으로 비겼습니다!')
                    gameData.myMoney += gameData.myBetting;
                    $poMoney.textContent = gameData.myMoney;
                }
                clearInterval(func);
                loseCheck();
                roundReset();
                return;
            }, 800)
        }
    }, 900);

})


const $reStart = document.getElementById('end-btn');
const $gameScoreEnd = document.getElementById('last-score');

//지는 조건을 체크
function loseCheck(){
    if (gameData.myMoney <= 0) {
        $gameScoreEnd.textContent = gameData.myScore;
        $gameOn.style.transition = '1.1s'
        $gameOn.style.opacity = '0.2';
        $gameOn.style.backgroundColor = '#000000';
        $endgame.classList.toggle('hide');
    } else{
        $shuffle.style.display = 'block';
        $shuffle.style.opacity = '0';
        $shuffle.style.transition = '0.2s';
        setTimeout(e=>{
            $shuffle.style.opacity = '1';
        }, 100)
        $betting.classList.remove('hide');
    }
}
//딜러 승리시
function roundLose() {
    if(gameData.myScore<=0)return;
    if(gameData.myMoney <= 0)return;
    $addScore.style.color = 'red';
    $addScoreEm.textContent = '- '+(gameData.myBetting*5);
    $addScore.classList.add('win') //스코어 내려감
    gameData.myScore -= gameData.myBetting*5;
    $gameScoreIng.textContent = gameData.myScore;
}

//라운드 종료시 초기화하는 함수
function roundReset() { 
    $hitStand.classList.remove('on');
    $betMoney.textContent = 0;
    gameData.myBetting = 0;
    gameData.dealCard = 0;
    gameData.myCard = 0;
    $myPoint.textContent = 0;
    $youPoint.textContent = 0;
    $hitStand.classList.toggle = ('on');
    flag = false;
    standFlag = false;
    
    while($playerUl.firstChild){
        $playerUl.removeChild($playerUl.firstChild);
    }
    while($dealerUl.firstChild){
        // $dealerUl.firstChild.style.animation = 'dealer-card-down 0.5s cubic-bezier(0.33, 1, 0.68, 1) 0.2s both';
        $dealerUl.removeChild($dealerUl.firstChild);
    }
    setTimeout(e=>{
        $addMoney.classList.remove('win')
        $addScore.classList.remove('win')
    }, 820)

}


$reStart.addEventListener('click', e => {
    location.reload();
})