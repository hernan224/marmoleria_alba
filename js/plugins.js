// Place any jQuery/helper plugins in here.

jQuery(document).ready(function () {
	
	// fancyBox
	jQuery('.fancybox').fancybox();
	
	// TinyNav
	jQuery("#nav").tinyNav({
		active: 'active',
	});
	
	// OWL Carousel
	jQuery("#slider").owlCarousel({
		singleItem: true,
		navigation: true,
		responsive: true
	});
});