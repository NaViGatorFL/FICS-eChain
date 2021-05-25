<template>
  <nav>
    <div class="menu-item"><a href= '/'>Home</a></div>

  </nav>
</template>

<script>

export default {
  name: 'navbar'
}
</script>

<style>
nav {
  display: flex;
  align-items: center;
  justify-content: center;
  color: aliceblue;
}
nav .menu-item {
  color: #222222;
  font-size: large;
  font-weight: bold;
  padding: 20px 100px;
  position: relative;
  text-align: center;
  border-bottom: 3px solid transparent;
  display: flex;
  transition: 0.4s;

}
nav .menu-item.active,
nav .menu-item:hover {
  background-color: whitesmoke;
  border-bottom-color: #FF5858;
}
nav .menu-item a {
  color: inherit;
  text-decoration: none;
}
</style>

