function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  
  class DoughChef {
    constructor() {
      this.isBusy = false;
    }
  

    async prepareDough(order) {
      order.startTime = new Date().toISOString();
      this.isBusy = true;
      console.log(`Dough chef starts preparing dough for order ${order.id} at ${new Date().toISOString()}`);
      await sleep(7); 
      console.log(`Dough chef finishes preparing dough for order ${order.id} at ${new Date().toISOString()}`);
      this.isBusy = false;
      return order;
    }
  }
  

  class ToppingChef {
    constructor() {
      this.isBusy = false;
    }
  
   
    async putToppings(order) {
      this.isBusy = true;
      console.log(`Topping chef starts putting toppings on order ${order.id} at ${new Date().toISOString()}`);
      await sleep(4 * order.toppings.length); 
      console.log(`Topping chef finishes putting toppings on order ${order.id} at ${new Date().toISOString()}`);
      this.isBusy = false;
      return order;
    }
  }
  
  
  class Oven {
    constructor() {
      this.isBusy = false;
    }
  
  
    async cook(order) {
      this.isBusy = true;
      console.log(`Oven starts cooking order ${order.id} at ${new Date().toISOString()}`);
      await sleep(10); 
      console.log(`Oven finishes cooking order ${order.id} at ${new Date().toISOString()}`);
      this.isBusy = false;
      return order;
    }
}

 
  class Waiter {
    constructor() {
      this.isBusy = false;
    }
  
   
    async serve(order) {
      this.isBusy = true;
      console.log(`Waiter starts serving order ${order.id} at ${new Date().toISOString()}`);
      await sleep(10); 
      console.log(`Waiter finishes serve order ${order.id} at ${new Date().toISOString()}`);
      this.isBusy = false;
      order.endTime = new Date().toISOString();
      return order;
    }
}

class Restaurant {
    constructor() {
      this.queue = []; 
      this.toppingChefQueue=[];
      this.cookQueue=[];
      this.waiterQueue=[];
      this.doughChefs = [new DoughChef(), new DoughChef()]; 
      this.toppingChefs = [new ToppingChef(), new ToppingChef(), new ToppingChef()]; 
      this.oven = new Oven();
      this.waiters = [new Waiter(), new Waiter()];
    }
  
    addOrder(order) {
      this.queue.push(order);
    }

    async toppingChefProcess() {
        const toppingChef = this.toppingChefs.find((chef) => !chef.isBusy);
        if(toppingChef && this.toppingChefQueue.length > 0) {
            toppingChef.putToppings(this.toppingChefQueue.shift()).then(val => {
                this.cookQueue.push(val);
                this.cookProcess()
                this.toppingChefProcess();
            });
            this.toppingChefProcess();
        }
    }

    async cookProcess() {
        if(this.cookQueue.length > 0) {
            this.oven.cook(this.cookQueue.shift()).then(order => {
                this.waiterQueue.push(order);
                this.waiterProcess();
                this.cookProcess();
            });
            this.cookProcess();
        }
    }

    async waiterProcess() {
        const waiter = this.waiters.find((waiter) => !waiter.isBusy);
        if(waiter && this.waiterQueue.length > 0) {
         waiter.serve(this.waiterQueue.shift()).then(order => {
            console.log(order);
            this.waiterProcess();
         });
         this.waiterProcess();
        }
    }

    async doughChefProcess() {
        const chef = this.doughChefs.find((chef) => !chef.isBusy);
        if (chef && this.queue.length > 0) {
          chef.prepareDough(this.queue.shift()).then((order) => {
            this.toppingChefQueue.push(order);
            this.toppingChefProcess();
            this.doughChefProcess();
          });
          this.doughChefProcess();
        }
      }
      

  
     async processOrders() {
        this.doughChefProcess();
    } 
}

const restaurant = new Restaurant();
restaurant.addOrder({ id: 1, toppings: ['pepperoni', 'mushrooms'] });
restaurant.addOrder({ id: 2, toppings: ['olives', 'peppers'] });
restaurant.addOrder({ id: 3, toppings: ['pepperoni', 'mushrooms'] });
restaurant.addOrder({ id: 4, toppings: ['olives', 'peppers'] });
restaurant.addOrder({ id: 5, toppings: ['pepperoni', 'mushrooms'] });
restaurant.addOrder({ id: 6, toppings: ['olives', 'peppers'] });
restaurant.addOrder({ id: 7, toppings: ['pepperoni', 'mushrooms'] });
restaurant.addOrder({ id: 8, toppings: ['olives', 'peppers'] });
restaurant.processOrders();
