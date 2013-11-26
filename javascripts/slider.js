var slider = (function($){
  
    var buildBullets = function(slider, bullet_holder){
      var number_of_slides = slider.getNumSlides()
      
      for(var i = 0; i < number_of_slides; i++){
        var el = $(document.createElement('li'))
                  .addClass('slider-indicators__indicator')         
        bullet_holder.append(el);        
      }
      
      return bullet_holder.find('.slider-indicators__indicator');
    };
  
    var init = function(slider_selector, indicators_selector){

      var bullet_holder = $(indicators_selector);      
      var slider_element = $(slider_selector).get(0);
      
      var slider_moved = function(pos){
        bullets.attr('class', 'slider-indicators__indicator');
        bullets.eq(pos).addClass('is-active');
      };
            
      var slider = Swipe(slider_element, {
          continuous: true,
          callback: slider_moved
      });
      
      bullet_holder.on('click', '.slider-indicators__indicator', function(ev){
                    var index = $(event.currentTarget).find('.slider-indicators__indicator').index(event.target);
                    slider.slide(index, 300)
                  });
      

      var bullets = buildBullets(slider, bullet_holder);
      console.log(slider.getPos())
      bullets.eq(slider.getPos()).addClass('is-active');
    };
    
    return {
      slidify: init
    };
  
})($);