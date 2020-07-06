<template>
  <v-container>
    <h3>ssss</h3>
    <v-simple-table fixed-header :dense="falsae" height="500px">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Calories</th>
          <th class="text-left">Calories</th>
          <th class="text-left">Calories</th>
          <th class="text-left">Calories</th>
          <th class="text-left">Calories</th>

        </tr>
      </thead>
      <tbody >
        <tr v-for="food in FOOD" :key="food.name">
          <td >{{ food.name }} </td>
          <td ><v-text-field  type="text" hide-details="auto" v-model="food.calories" /></td>
          <td ><v-text-field  type="text" hide-details="auto" v-model="food.calories" /></td>
          <td><v-text-field  type="text" hide-details="auto" v-model="food.calories" /></td>
          <td ><v-text-field  type="text" hide-details="auto" v-model="food.calories" /></td>
          <td ><v-text-field  type="text" hide-details="auto" v-model="food.calories" /></td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        FOOD: [
          {
            name: 'Burger',
            calories: 660,
          },
          {
            name: 'Sandwich',
            calories: 660,
          },
          {
            name: 'Cheese Whopper',
            calories: 790,
          },
          {
            name: 'Bacon King',
            calories: 1150,
          },
          {
            name: 'Farmhouse',
            calories: 1220,
          },
          {
            name: 'Grilled Chicken',
            calories: 470,
          },
          {
            name: 'Snickers Pie',
            calories: 300,
          },
          {
            name: 'Veggie Burger',
            calories: 390,
          },
          {
            name: 'Donut',
            calories: 500,
          },
          {
            name: 'Grilled Hot Dog',
            calories: 310,
          },
          {
            name: 'French Fry',
            calories: 380,
          },          
        ],
      }
    },
  }
</script>