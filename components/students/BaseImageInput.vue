<template>
  <div
    class="base-image-input"
    :style="{ 'background-image': `url(${profileImage})` }"
    @click="chooseImage"
  >
    <span
      v-if="!profileImage"
      class="placeholder"
    >
      Choose an Image
    </span>
    <input
      class="file-input"
      ref="fileInput"
      type="file"
      @input="onSelectFile"
    >
  </div>
</template>
<script>

export default {
   name: 'base-image-input',
   props: ['profileImage'],
   data () {
    return {
    }
  },
  methods: {
    chooseImage () {
      this.$refs.fileInput.click()
    },
    onSelectFile () {
      const input = this.$refs.fileInput
      const files = input.files
      if (files && files[0]) {
      const reader = new FileReader
      reader.onload = e => {
        this.profileImage = e.target.result
      }
      reader.readAsDataURL(files[0])
      this.$emit('input', this.profileImage)
     }
    }
  }
}
</script>

<style scoped>
.base-image-input {
  display: block;
  width: 200px;
  height: 200px;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}
.placeholder {
  background: #F0F0F0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 18px;
  font-family: Helvetica;
}
.placeholder:hover {
  background: #E0E0E0;
}
.file-input {
  display: none;
}
</style>