(function () {

    const EXPERIMENT_PREFIX = 'exp_36';

    function track(action, optlabel = null) {

        const params = {
            'acn_eventaction': action,
            'acn_eventcategory': EXPERIMENT_PREFIX,
            'event': 'acn_experience'
        };

        if (optlabel) {
            params.acn_eventlabel = optlabel
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');

        }

        dataLayer.push(params);
    }

    function customGoals() {
        // Top Filter Clicks  v0, v1   
        // This should fire when a user clicks on any of the filter CTAs at the top of the PLP and the event label should change based on the name of the specific filter clicked. 
        document.querySelectorAll('.refinements__categories__button').forEach(pill => {
            pill.addEventListener('click', e => { track('top_filter', e.target.innerText); });
        });

        document.querySelector('#product-search-results').addEventListener('click',(e)=>{
            // Filter Click  v0, v1   
            // This should fire when a user clicks on the filter icon on the top left of the PLP cards to open the filters.
            if(e.target.closest('#flyout-filter_button-open')){ track('open_filter'); }

            // Sort Click     v0, v1 
            // This should fire when a user clicks on the sort icon on the top right of the PLP cards to open the sorting.
            else if(e.target.closest('#flyout-sorting_button-open')){ track('open_sort');  }
        })

        document.querySelector('.product-grid').addEventListener('click',(e)=>{
            // Discover CTA Clicks v0, v1 
            // This should fire when a user clicks on any CTA on the PLPs that says “Discover” 
            if(e.target.getAttribute('title') === "DISCOVER" || e.target.getAttribute('title') === "Discover"){ track('discover_cta'); }

            // Wishlist Click    v0, v1 
            // This should fire when a user clicks on the little heart on the product tiles to add the product to wishlist. 
            else if(e.target.className === 'bif bif-love'){ track('wishlist_click'); }

            // Load More Click   v0, v1 
            // This should fire when a user clicks on load more CTA at the bottom of the PLP 
            else if(e.target.className === 'btn btn-primary more btn-plp-more'){ track('load_more'); }
        });

        document.querySelector('.content-grid__page-slot-wrapper').addEventListener('click',(e)=>{
            // Product Compare View Product   v0, v1 
            // This should fire when a user clicks on "view product” on any of the products in the product comparison section at the bottom of the PLP
            if(e.target.className === 'btn btn-secondary btn-sm view-product'){ track('product_compare', 'view_product'); }
            
            // Product Compare Color   v0, v1 
            // This should fire when a user clicks on the color options in the product compare section at the bottom of the PLP
            else if(e.target.classList.contains('swatch__image')){ track('product_compare', 'choose_color'); }
        });
    }

    function myfunctions(){
        stylesPLPGrid();
        reorder();
    }

    function stylesPLPGrid() {
        var products = document.querySelectorAll('.product-grid .row .col-6');
        for (var i = 0; i < products.length; i++) {
            if(products[i].getAttribute("class") == 'col-6 p-0 col-12 col-md-8 grid-card-container--double-width' ||
               products[i].getAttribute("class") == 'col-6 p-0 col-12 grid-card-container--double-width col-md-6 col-md-3'){
                if (products.length > 4) {
                    products[i].classList.remove('col-md-8');
                    products[i].classList.remove('col-md-3');
                    products[i].classList.add('col-md-6');
                }else {
                    products[i].classList.remove('col-md-8');
                    products[i].classList.add('col-md-3');
                }
            }else{
                products[i].classList.remove('col-md-4');
                products[i].classList.add('col-md-3');
            }
        }

        var products2 = document.querySelectorAll('.product-grid .row .col-6 .editorial-card');
        for (var i = 0; i < products2.length; i++) {
            if(products2[i].classList.contains('editorial-card--content-top')){
                products2[i].classList.remove('editorial-card--content-top');
                products2[i].classList.add('editorial-card--content-bottom');
            }
        }
    }

    function reorder(){
        // move secondaries content card
        var products = document.querySelectorAll('.product-grid .row .col-6');
        for (var i = 0; i < products.length; i++) {
            var card1 = products[i];
            if(products[i].getAttribute("class") == 'col-6 p-0 col-md-3'){
                if(products.length>4){
                    if( 12 < products.length ){ //position absolute
                        products[12].before(card1);
                    }
                    else{
                        products[products.length-1].after(card1);
                    }
                }else{
                    products[products.length-1].after(card1);
                }    
            }
        }

        var products = document.querySelectorAll('.product-grid .row .col-6');
        var card2 = products[0];
        if(products[0].getAttribute("class") == 'col-6 p-0 col-12 grid-card-container--double-width col-md-6' ){
            products[4].after(card2);
        }
        if(products[0].getAttribute("class") == 'col-6 p-0 col-12 grid-card-container--double-width col-md-3' ){
            products[3].after(card2);
        }
    }

    function resetFilters(){
        document.querySelector('.filter-sort-panel__filters-reset').addEventListener('click',(e)=>{
            if( e.target.className === 'bif bif-close' ||  e.target.className === 'reset filter-sort-panel__filters-reset-btn' ){
                setTimeout(function(){ reorder(); }, 1000); }
        });
    }

    function obser(){
        // TOP MENU
        const categories = document.querySelectorAll('.refinements__categories__button');
        for (let i = 0; i < categories.length; i++) {
            categories[i].addEventListener('click', () => {
                setTimeout(function(){ reorder(); }, 1000);
            });
        }

        // FILTERS
        document.querySelector('.flyout-filter').addEventListener('click',(e)=>{
            // checkboxes
            if( e.target.className === 'refinements-body__content checkbox-button-control__label' ||
                e.target.classList.contains('refinements-body__swatch') ){
                setTimeout(function(){ reorder(); }, 500);
            }

            // modal
            if( e.target.className === 'flyout__overlay js-flyout-overlay' || 
                e.target.className === 'btn btn-block btn-primary flyout__see-results-button js-flyout-close'){ 
                reorder(); resetFilters(); }
        });


        //SORT
        document.querySelector('.filter-sort-panel').addEventListener('click',(e)=>{
           // radioSort
            if( e.target.className === 'recommended-for-you' || e.target.className === 'inventory' ||
                e.target.className === 'product-name-ascending' || e.target.className === 'product-name-descending' ){ 
                setTimeout(function(){ reorder(); }, 500);
            }

            // modal
            if(e.target.className === 'flyout__overlay js-flyout-overlay'){ reorder(); }
        });


        //OBSERVER
        const container = document.querySelector(".product-grid");
        
        function logChanges(records, observer) {
            let inProgress = true;
            for (const record of records) {
                if( (record.addedNodes.length || record.removedNodes.length) && inProgress){
                    stylesPLPGrid();
                    if(inProgress){
                        inProgress = false;
                    }
                }
                if (record.target.childNodes.length === 0) {
                    observer.disconnect();
                }
            }
        }

        const observerOptions = { childList: true, subtree: true, };

        const observer1 = new MutationObserver(logChanges);
        observer1.observe(container, observerOptions);
    }

    function apply(context, template) {
        const parent = document.querySelector('.breadcrumb');
        const child = document.createElement("div");
        child.setAttribute("class", "child");
        parent.appendChild(child);

        const contentZoneSelector = '.child'; // Evergage.getContentZoneSelector(context.contentZone);
        return Evergage.DisplayUtils
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                const html = template(context);
                Evergage.cashDom(element).html(html);
                myfunctions();
                obser();
                customGoals();
            });
    }

    function reset(context, template) {

        /** Remove the template from the DOM to reset the template. */
        Evergage.cashDom("#evg-new-template").remove();
    }

    function control(context) {

        const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
        return Evergage.DisplayUtils
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                Evergage.cashDom(element).attr({
                    "data-evg-campaign-id": context.campaign,
                    "data-evg-experience-id": context.experience,
                    "data-evg-user-group": context.userGroup
                });
            });
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

})();