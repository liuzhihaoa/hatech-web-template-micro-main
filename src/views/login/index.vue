<template>
  <div class="login-page">
    <hatech-screen v-if="showScreen" :shapeNum="300" @onClick="onClickScreen"></hatech-screen>
    <hatech-login @login="onLogin">
      <template slot="title">
        <!-- TODO:根据项目修改 -->
        <p>Hatech 微前端 </p>
        <p>主应用项目模板</p>
      </template>
      <template slot="sub-title">
        <span />
      </template>
    </hatech-login>
  </div>
</template>

<script>
import { HatechScreen } from "hatech-web-component-screen";
import { HatechLogin } from "hatech-web-component-login";
import { mapActions, mapMutations } from "vuex";

export default {
  components: { HatechLogin, HatechScreen },
  data() {
    return {
      showScreen: true,
    };
  },
  methods: {
    ...mapMutations('app', ['GoToFirstRoute']),
    ...mapActions("app", ["Login"]),
    /**
     * 登录
     */
    async onLogin(params) {
      const response = await this.Login({
        params,
      });
      console.log('page login : ', response)
      if (response && response.success) {
        this.$message.success(response.msg);
        this.GoToFirstRoute()
      }
    },
    onClickScreen() {
      this.showScreen = false;
    },
  },
};
</script>