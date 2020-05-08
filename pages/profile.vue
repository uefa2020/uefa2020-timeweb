<template>
  <v-col
    class="mx-auto"
    cols="9" :sm="sm" :md="md" :lg="lg"
  >
    <v-card class="elevation-12" color="purple lighten-5">
      <v-toolbar
        color="purple lighten-1"
        dark
        flat
      >
        <v-icon left large>{{iconToolbar}}</v-icon>
        <v-toolbar-title
          class="text-center"
          :style="{width: '100%', whiteSpace: 'normal !important'}"
        >
          Профиль участника
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="py-1">
        <v-form ref="form" lazy-validation>
          <v-text-field
            label="Ник"
            name="nickname"
            type="text"
            color="purple lighten-2"
            v-model="gambler.nickname"
            :rules="[rules.required]"
          />

          <v-text-field
            label="Фамилия"
            name="family"
            color="purple lighten-2"
            type="text"
            v-model="gambler.family"
            :rules="[rules.required]"
          />

          <v-text-field
            label="Имя"
            name="name"
            type="text"
            color="purple lighten-2"
            v-model="gambler.name"
            :rules="[rules.required]"
          />

          <v-row class="justify-space-between">
            <v-col cols="auto" class="py-0">
              <v-label>Пол</v-label>
              <v-radio-group class="mt-0" v-model="gambler.sex" row :rules="[rules.required]">
                <v-radio label="м" color="primary" value="м"></v-radio>
                <v-radio label="ж" color="pink" value="ж"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col v-if="gambler.photo" cols="auto" class="py-0">
              <v-img width="50" height="67" :src="`/photo/${gambler.photo}`"/>
            </v-col>
          </v-row>

          <div>
            <v-file-input
              :rules="[rules.image, this.$store.getters['gambler/isSign'] ? rules.required : true]"
              accept="image/png, image/jpeg"
              prepend-icon="fas fa-camera-retro"
              :label="this.$store.getters['gambler/isSign'] ? 'Фото участника' : 'Заменить фото'"
              show-size
              v-model="file"
            />
            <div
              class="mb-1 font-italic indigo--text text--darken-4 caption"
              :style="{lineHeight: '12px'}"
            >
              Пожалуйста, загружайте фото с соотношением сторон 3х4. Постарайтесь, чтобы Ваше лицо располагалось
              ближе к центру
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center pt-0 pb-3">
        <v-btn
          :loading="loading"
          :disabled="loading"
          class="white--text"
          color="purple lighten-1"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
  export default {
    name: 'profile',
    layout({store}) {
      return (store.getters['gambler/isAuth'] ? 'default' : 'auth')
    },
    async asyncData({store}) {
      const user = await store.getters['gambler/getGambler'];
      const isSign = await store.getters['gambler/isSign'];

      return {
        user,
        isSign
      }
    },
    data() {
      return {
        gambler: {
          id: null,
          nickname: '',
          family: '',
          name: '',
          sex: '',
          photo: ''
        },
        file: null,
        rules: {
          required: value => !!value || 'Поле должно быть заполнено',
          image: value => !value || value.size < 2000000 || 'Размер файла не должен быть больше 2Мб',
        },
        loading: false
      }
    },
    mounted() {
      this.gambler.id = this.user.id;
      this.gambler.nickname = this.user.nickname;
      this.gambler.family = this.user.family;
      this.gambler.name = this.user.name;
      this.gambler.sex = this.user.sex;
      this.gambler.photo = this.user.photo;
    },
    computed: {
      sm() {
        return (this.$store.getters['gambler/isAuth'] ? '7' : '6')
      },
      md() {
        return (this.$store.getters['gambler/isAuth'] ? '7' : '4')
      },
      lg() {
        return (this.$store.getters['gambler/isAuth'] ? '6' : '3')
      },
      iconToolbar() {
        let icon = '';

        switch (this.gambler.sex) {
          case 'м':
            icon = 'fas fa-male';
            break;
          case 'ж':
            icon = 'fas fa-female';
            break;
          default:
            icon = 'fas fa-user'
        }

        return icon
      }
    },
    methods: {
      async save() {
        if (!this.$refs.form.validate()) return;

        this.loading = true;

        await this.$store.dispatch('gambler/profile', {
          gambler: this.gambler,
          file: this.file
        });

        this.loading = false;

        if (await this.$store.getters['gambler/isAuth']) {
          this.$socket.emit('changeProfile', {
            nickname: this.gambler.nickname,
            sex: this.gambler.sex,
            isSign: this.isSign
          });
          this.$router.push('/chat')
        }
      }
    }
  }
</script>

<style scoped>

</style>
