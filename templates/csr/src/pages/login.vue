<template>
  <div class="login-wrap">
    <div class="loginBox">
      <h2>{{ $t("name") }}</h2>
      <el-form ref="formRef" :model="formProxy.form" :rules="rules">
        <el-form-item prop="user">
          <el-input
            v-model="formProxy.form.user"
            clearable
            :disabled="loading"
            @focus="userActive = true"
            @blur="userActive = !!formProxy.form.user"
            @keyup="keyNext($event)"
          ></el-input>
          <label :class="{ 'active-label': userActive }" for="user">{{
            $t("login.userName")
          }}</label>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            v-model="formProxy.form.pwd"
            class="pwd-input"
            type="password"
            clearable
            :disabled="loading"
            @focus="pwdActive = true"
            @blur="pwdActive = !!formProxy.form.pwd"
            @keyup="keyEnter($event)"
          ></el-input>
          <label :class="{ 'active-label': pwdActive }" for="password">{{
            $t("login.passWord")
          }}</label>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="btn" :loading="loading" @click="login">
        {{ $t("login.btnText") }}
        <span class="btn-border"></span>
        <span class="btn-border"></span>
        <span class="btn-border"></span>
        <span class="btn-border"></span>
      </el-button>
    </div>
    <div class="footer">
      <p class="copy-right">Copyright &copy; 2021 &nbsp;Hlianfa</p>
    </div>
  </div>
</template>
<script lang="ts">
import md5 from "js-md5";
import { defineComponent, reactive, ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton } from "element-plus";
import { validatePhone } from "helper/validater";
import { USER_INFOR_KEY, USER_TOKEN_KEY } from "config/others";
import { getCookie, setCookie } from "helper/utils";
import { router } from "@/route";
import http from "helper/http";
import { useI18n } from "vue-i18n";

declare interface FormProp {
  user?: string;
  pwd?: string;
}

export default defineComponent({
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },
  setup() {
    const formProxy = reactive({
      form: {
        user: "",
        pwd: "",
      },
    });
    const loading = ref(false);
    const formRef = ref<typeof ElForm | null>(null);
    function login() {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true;
          const form: FormProp = formProxy.form;
          http
            .post("/user/login", {
              user: form.user,
              pwd: md5(form.pwd),
            })
            .then((res: any) => {
              const { token, user_info } = res;
              setCookie(USER_TOKEN_KEY, token, 7);
              setCookie(USER_INFOR_KEY, JSON.stringify(user_info), 7);
              router.push("/home");
              loading.value = false;
            })
            .catch(() => {});
        }
      });
    }
    // 页面动效
    const userActive = ref(false);
    const pwdActive = ref(false);
    // 键盘交互
    function keyNext(ev: KeyboardEvent) {
      if (ev.code === "Enter") {
        const [target] = Array.from(
          document.querySelectorAll(".pwd-input input")
        );
        // @ts-ignore
        target && target.focus();
      }
    }
    function keyEnter(ev: KeyboardEvent) {
      if (ev.code === "Enter") {
        this.login();
      }
    }
    const { t } = useI18n();
    const validateUser = (rule, value, callback) => {
      if (validatePhone(value)) {
        callback();
        return true;
      }
      callback(new Error(t("login.validatePhoneWarn")));
      return new Error(t("login.validatePhoneWarn"));
    };
    // 判断是否已登录
    const token = getCookie(USER_TOKEN_KEY);
    if (token) {
      router.push("/home");
    }
    return {
      rules: {
        user: [
          {
            required: true,
            message: t("login.validatePhoneRequired"),
            trigger: "blur",
          },
          { validator: validateUser, trigger: "blur" },
        ],
        pwd: [
          {
            required: true,
            message: t("login.validatePassportRequired"),
            trigger: "blur",
          },
          {
            min: 12,
            max: 18,
            message: t("login.validatePassportWarn"),
            trigger: "blur",
          },
        ],
      },
      formRef,
      formProxy,
      userActive,
      pwdActive,
      loading,
      login,
      keyNext,
      keyEnter,
    };
  },
});
</script>
<style lang="scss">
$light-color: #08d3f9;
.login-wrap {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/wallhaven-6k5l1x.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $light-color;
  .loginBox {
    width: 450px;
    height: 400px;
    background-color: rgba(7, 11, 17, 0.8);
    border-radius: 10px;
    box-shadow: 0 15px 25px 0 rgba(0, 0, 0, 0.6);
    padding: 30px 40px;
    box-sizing: border-box;
    h2 {
      text-align: center;
      color: aliceblue;
      margin-bottom: 18px;
      font-family: "Courier New", Courier, monospace;
    }
    .el-form-item {
      height: 66px;
      border-bottom: 1px solid #fff;
      margin-bottom: 40px;
      position: relative;
      .el-input {
        width: 100%;
        height: 100%;
        padding-top: 25px;
        input {
          font-size: 18px;
          color: #fff;
          background-color: transparent;
          border: none;
        }
        .el-input__suffix {
          height: unset;
          top: 25px;
        }
      }
      // input:-webkit-autofill {
      //   box-shadow: 0 0 0 1000px #0c1622 inset;
      //   -webkit-text-fill-color: #fff;
      // }
      label {
        position: absolute;
        left: 0;
        top: 20px;
        transition: all 0.158s linear;
        font-size: 18px;
      }
      .active-label {
        top: 0px;
        font-size: 14px;
      }
    }
    .btn {
      padding: 10px 30px;
      margin-top: 10px;
      color: $light-color;
      position: relative;
      overflow: hidden;
      text-transform: uppercase;
      left: 35%;
      background-color: transparent;
      border: none;
      font-size: 18px;
      transition: all 0.518s linear;
      &:hover {
        border-radius: 5px;
        color: #fff;
        background: $light-color;
        cursor: pointer;
      }
      &.is-loading {
        color: #fff;
        background: $light-color;
        box-shadow: 0 0 5px 0 $light-color, 0 0 25px 0 $light-color,
          0 0 50px 0 $light-color, 0 0 100px 0 $light-color;
      }
      .btn-border {
        position: absolute;
        &:nth-child(1) {
          width: 100%;
          height: 2px;
          background: -webkit-linear-gradient(left, transparent, $light-color);
          left: -100%;
          top: 0px;
          animation: line1 1s linear infinite;
        }

        &:nth-child(2) {
          width: 2px;
          height: 100%;
          background: -webkit-linear-gradient(top, transparent, $light-color);
          right: 0px;
          top: -100%;
          animation: line2 1s 0.25s linear infinite;
        }

        &:nth-child(3) {
          width: 100%;
          height: 2px;
          background: -webkit-linear-gradient(left, $light-color, transparent);
          left: 100%;
          bottom: 0px;
          animation: line3 1s 0.75s linear infinite;
        }

        &:nth-child(4) {
          width: 2px;
          height: 100%;
          background: -webkit-linear-gradient(top, transparent, $light-color);
          left: 0px;
          top: 100%;
          animation: line4 1s 1s linear infinite;
        }
      }
    }
  }
  .footer {
    position: absolute;
    display: flex;
    bottom: 0;
    width: 100%;
    height: 64px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    .copy-right {
      position: relative;
      margin: auto;
      color: rgba(255, 255, 255, 0.3);
      white-space: nowrap;
    }
  }
}
@keyframes line1 {
  50%,
  100% {
    left: 100%;
  }
}
@keyframes line2 {
  50%,
  100% {
    top: 100%;
  }
}
@keyframes line3 {
  50%,
  100% {
    left: -100%;
  }
}
@keyframes line4 {
  50%,
  100% {
    top: -100%;
  }
}
</style>
