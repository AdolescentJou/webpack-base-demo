module.exports = function(content,map,meta) {
  console.log('加载自定义loader');
  return 'body{ background-color:#394763}'+content;
 }

 module.exports.pitch = function(content,map,meta) {
  console.log('加载自定义pitch loader');
  return;
 }