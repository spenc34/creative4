Vue.filter('currency', function (value) {
    return parseFloat(value).toFixed(2);
});

var app = new Vue({
  el: "#app",
  data: {
    items: [],
    categories: ["Food", "Clothes"],
    amount: '',
    description: '',
    budget: '',
    message: '',
    overbudget: '',
    category: 'Category',
    month: 'March',
    hasBudget: false,
  },
  created: function() {
    this.getItems();
    this.getCategories();
    this.getBudget();
    this.isOverBudget();
  },
  computed: {
    totalSpent: function() {
      let total = 0;
      for (var i = 0; i < this.items.length; i++) {
        total += parseInt(this.items[i].amount);
      }
      return total;
    }
  },
  methods: {
    validateForm: function() {
      var success = true;
      if (this.amount === '') {
        success = false;
        document.getElementById("amountInput").style.borderColor = "red";
      }
      if (this.description === '') {
        success = false;
        document.getElementById("descriptionInput").style.borderColor = "red";
      }
      if (this.category === 'Category') {
        success = false;
        document.getElementById("categorySelect").style.borderColor = "red";
      }
      if (document.getElementById("datepicker").value === '') {
        success = false;
        document.getElementById("datepicker").style.borderColor = "red";
      }
      return success;
    },
    resetFormColor: function() {
      document.getElementById("amountInput").style.border = "1px solid #ced4da";
      document.getElementById("descriptionInput").style.border = "1px solid #ced4da";
      document.getElementById("categorySelect").style.border = "1px solid #ced4da";
      document.getElementById("datepicker").style.border = "1px solid #ced4da";
    },
    addItem: function() {

      if (!this.validateForm()) {
        return;
      }

      axios.post("http://104.236.156.21:3030/api/items", {
        amount: this.amount,
        description: this.description,
        category: this.category,
        date: document.getElementById('datepicker').value,
        month: this.month,
      }).then(response => {
        this.amount = "";
        this.description = "";
        this.category = "Category";
        document.getElementById('datepicker').value = "",
        this.resetFormColor();
        this.getItems();

        this.isOverBudget();

        if (this.overbudget) {
          this.getMessage();
        }

        return true;
      }).catch(err => {
        console.log(err);
      });
    },
    getItems: function() {
      axios.get("http://104.236.156.21:3030/api/items").then(response => {
        this.items = response.data;
        this.isOverBudget();
        return true;
      }).catch(err => {
        console.log(err);
      });
    },
    fixDecimal: function(amount) {
      return amount.toFixed(2);
    },
    getCategories: function() {
      axios.get("http://104.236.156.21:3030/api/categories").then(response => {
        this.categories = response.data;
        return true;
      }).catch(err => {
        console.log(err);
      });
    },
    getBudget: function() {
      axios.get("http://104.236.156.21:3030/api/budget/" + this.month).then(response => {
        this.budget = response.data;
        if (this.budget !== '')
          this.hasBudget = true;
        return true;
      }).catch(err => {
        console.log(err);
      });
    },
    setBudget: function() {
      axios.post("http://104.236.156.21:3030/api/budget", {
        month: this.month,
        budget: this.budget,
      }).then(response => {
        this.budget = response.data;
        this.balance = this.budget;
        this.hasBudget = true;
        return true;
      }).catch(err => {
        console.log(err);
      });
    },
    deleteItem: function(item) {
      axios.delete("http://104.236.156.21:3030/api/items/" + item.id).then(response => {
        this.getItems();
      }).catch(err => {
        console.log(err);
      });
    },
    getMessage: function() {
      axios.get("http://104.236.156.21:3030/api/message").then(response => {
        this.message = response.data;
      }).catch(err => {
        console.log(err);
      });
    },
    isOverBudget: function() {
      this.overbudget = this.totalSpent > this.budget;
    }
  },

});

$( function() {
  $( "#datepicker" ).datepicker();
} );
