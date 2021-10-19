window.onscroll = function(e) {
    // print "false" if direction is down and "true" if up
    if(this.oldScroll > this.scrollY) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ bottom: 0, behavior: 'smooth' });
    }
    this.oldScroll = this.scrollY;
  }
