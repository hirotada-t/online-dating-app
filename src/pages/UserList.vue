<template>
  <q-page class="flex flex-center column">
    <h2>UserList</h2>
    <div class="q-pa-md row flex-start">
      <div class="col-3 q-px-sm q-my-sm" v-for="user in randomUser" :key="user.id.value">
        <q-card>
          <img :src="user.picture.large">
          <q-card-section>
            <div class="text-h6">{{user.name.first}}</div>
            <div class="text-subtitle2">age: {{user.dob.age}}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script>
  const apiURL = 'https://randomuser.me/api/?results=5';
  const apiOption = {
    method: 'get',
  }
  export default {
    name: 'UserList',
    data() {
      return {
        randomUser: null,
      }
    },
    methods: {
      async getRandomUser() {
        const response = await fetch(apiURL, apiOption).then(res => res.json());
        this.randomUser = response.results;
        console.log(this.randomUser)
      },
    },
    created() {
      this.getRandomUser();
    },
  }
</script>
