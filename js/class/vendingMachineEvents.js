class VendingMachineEvents {
    constructor() {
        const vMachine = document.querySelector('.section1');
        this.balance = vMachine.querySelector('.bg-box p');
        this.itemList = vMachine.querySelector('.cola-list');
        this.inputCostEl = vMachine.querySelector('#input-money');
        this.btnPut = vMachine.querySelector('#input-money+.btn');
        this.btnReturn = vMachine.querySelector('.bg-box+.btn');
        this.btnGet = vMachine.querySelector('.btn-get');
        this.stagedList = vMachine.querySelector('.get-list');

        const myinfo = document.querySelector('.section2');
        this.myMoney = myinfo.querySelector('.bg-box strong');

        const getInfo = document.querySelector('.section3');
        this.getList = getInfo.querySelector('.get-list');
        this.txtTotal = getInfo.querySelector('.total-price');
    }

    stagedItemGenerator(target) {
        const stagedItem = document.createElement('li');
        stagedItem.dataset.item = target.dataset.item;
        stagedItem.dataset.price = target.dataset.price;
        stagedItem.innerHTML = `
        <img src="./img/${target.dataset.img}" alt="">
            ${target.dataset.item}
        <strong>1
            <span class="a11y-hidden">개</span>
        </strong>
        `;
        this.stagedList.append(stagedItem);
    }


    bindEvent() {
        this.btnPut.addEventListener('click', () => {
            const inputCost = parseInt(this.inputCostEl.value);
            const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));
            const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));

            if (inputCost) {
                if (inputCost <= myMoneyVal && inputCost > 0) {
                    this.myMoney.textContent = new Intl.NumberFormat().format(myMoneyVal - inputCost) + '원';
                    this.balance.textContent = new Intl.NumberFormat().format((balanceVal ? balanceVal : 0) + inputCost) + '원';
                } else {
                    alert('소지금이 부족합니다.');
                }
                this.inputCostEl.value = "";
            }
        });

        this.btnReturn.addEventListener('click', () => {
            const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));
            const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));

            if (balanceVal) {
                this.myMoney.textContent = new Intl.NumberFormat().format(balanceVal + myMoneyVal) + '원';
                this.balance.textContent = null;
            }
        });

        this.btnsCola = document.querySelectorAll('.section1 .btn-cola');

        this.btnsCola.forEach((item) => {
            item.addEventListener('click', (event) => {
                const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));
                const targetEl = event.currentTarget;
                const targetElPrice = parseInt(targetEl.dataset.price);
                const stagedListitem = this.stagedList.querySelectorAll('li');
                let isStaged = false;

                if (balanceVal >= targetElPrice) {
                    this.balance.textContent = new Intl.NumberFormat().format(balanceVal - targetElPrice) + '원';

                    for (const item of stagedListitem) {
                        if (targetEl.dataset.item === item.dataset.item) {
                            item.querySelector('strong').firstChild.textContent = parseInt(item.querySelector('strong').firstChild.textContent) + 1;
                            isStaged = true;
                            break;
                        }
                    }

                    if (!isStaged) {
                        this.stagedItemGenerator(event.currentTarget);
                    }

                    targetEl.dataset.count--;

                    if (!parseInt(targetEl.dataset.count)) {
                        targetEl.insertAdjacentHTML('beforeEnd', `
                            <strong class= "soldout">
                                <span>품절</span>
                            </strong>
                            `
                        );

                        targetEl.disabled = "disabled";
                    }
                } else {
                    alert('입금한 금액이 부족합니다.');
                }
            })
        });

        this.btnGet.addEventListener('click', () => {
            const itemStagedList = this.stagedList.querySelectorAll('li');
            const itemGetList = this.getList.querySelectorAll('li');
            let totalPrice = 0;

            for (const itemStaged of itemStagedList) {
                let isGet = false;
                for (const itemGet of itemGetList) {
                    console.log(itemStaged.querySelector('strong'));
                    if (itemStaged.dataset.item === itemGet.dataset.item) {
                        itemGet.querySelector('strong').firstChild.textContent = parseInt(itemGet.querySelector('strong').firstChild.textContent) + parseInt(itemStaged.querySelector('strong').firstChild.textContent);
                        isGet = true;
                        break;
                    }
                }

                if (!isGet) {
                    this.getList.append(itemStaged);
                }
            }

            this.stagedList.innerHTML = null;

            this.getList.querySelectorAll('li').forEach((itemGet) => {
                totalPrice += parseInt(itemGet.dataset.price) * parseInt(itemGet.querySelector('strong').firstChild.textContent);
            });
            this.txtTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(totalPrice)} 원`;
        });

    }
}

export default VendingMachineEvents;