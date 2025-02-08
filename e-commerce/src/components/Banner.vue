<template>
  <div
    class="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden shadow-xl"
  >
    <!-- Background Image -->
    <img
      src="../../public/final.jpg"
      alt="Banner"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
    <!-- Text Content -->
    <div
      class="relative z-10 flex flex-col justify-center items-start h-full px-4 sm:px-8 lg:px-12 text-white"
    >
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3">
        Welcome to Our Store
      </h1>
      <p class="text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-md">
        Discover amazing products and exclusive deals just for you.
      </p>
    </div>
  </div>
</template>

<script setup>
const handleAction = () => {
  console.log('Shop Now button clicked!')
}
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
