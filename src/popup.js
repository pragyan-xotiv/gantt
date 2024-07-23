export default class Popup {
    constructor(parent, custom_html, popup_options) {
        this.parent = parent;
        this.custom_html = custom_html;
        this.popup_options = popup_options || {};
        this.width = this.popup_options.width || 200;
        this.height = this.popup_options.height || 56;
        this.additional_pixel = this.popup_options.additional_pixel || 7;
        this.make();
    }

    make() {
        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `;

        this.hide();

        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.pointer = this.parent.querySelector('.pointer');
    }

    show(options) {
        if (!options.target_element) {
            throw new Error('target_element is required to show popup');
        }
        if (!options.position) {
            options.position = 'cursor-position';
        }
        const target_element = options.target_element;

        if (this.custom_html) {
            let html = this.custom_html(options.task);
            html += '<div class="pointer"></div>';
            this.parent.innerHTML = html;
            this.pointer = this.parent.querySelector('.pointer');
        } else {
            // set data
            this.title.innerHTML = options.title;
            this.subtitle.innerHTML = options.subtitle;
            this.parent.style.width = this.parent.clientWidth + 'px';
        }

        // set position
        let position_meta;
        if (target_element instanceof HTMLElement) {
            position_meta = target_element.getBoundingClientRect();
        } else if (target_element instanceof SVGElement) {
            position_meta = options.target_element.getBBox();
        }

        if (options.position === 'left') {
            this.parent.style.left =
                position_meta.x + (position_meta.width + 10) + 'px';
            this.parent.style.top = position_meta.y + 'px';

            this.pointer.style.transform = 'rotateZ(90deg)';
            this.pointer.style.left = '-7px';
            this.pointer.style.top = '2px';
        }

        if (options.position === 'cursor-position') {
            const width = 200;
            const height = 56;
            if (options.event) {
                this.parent.style.left =
                    options.event.offsetX - this.width / 2 + 'px';
                this.parent.style.top =
                    position_meta.y -
                    (this.height + this.additional_pixel) +
                    'px';
            } else {
                this.parent.style.left =
                    position_meta.x + position_meta.width / 2 + 'px';
                this.parent.style.top = position_meta.y - this.height + 'px';
            }
            this.parent.style.width = this.width + 'px';
            this.parent.style.height = this.height + 'px';
            this.parent.style['background-color'] = '#AE3756';

            this.pointer.style.transform = 'rotateZ(360deg)';
            this.pointer.style.left = this.width / 2 + 'px';
            this.pointer.style.top = this.height + 'px';
            this.pointer.style['border-top-color'] = '#AE3756';
        }

        // show
        this.parent.style.opacity = 1;
    }

    hide() {
        this.parent.style.opacity = 0;
        this.parent.style.left = 0;
    }
}
