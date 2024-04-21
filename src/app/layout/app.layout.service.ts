import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    _config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14,
    };
    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };
    private configUpdate = new Subject<AppConfig>();
    configUpdate$ = this.configUpdate.asObservable();
    private overlayOpen = new Subject<any>();
    overlayOpen$ = this.overlayOpen.asObservable();

    constructor() {
        const config = this.getConfig();
        if (this.updateStyle(config)) {
            this.changeTheme();
        }
        this.changeScale(config.scale);
        this.onConfigUpdate();
    }

    getConfig(): AppConfig {
        return {...this._config};
    }

    setConfig(config: AppConfig) {
        this._config = {...config};
        this.onConfigUpdate();
    }

    updateStyle(config: AppConfig) {
        return (
            config.theme !== this._config.theme ||
            config.colorScheme !== this._config.colorScheme
        );
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive =
                !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive =
                !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.getConfig().menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    // onConfigUpdate() {
    //     this.configUpdate.next(this.getConfig());

    changeTheme() {
        const config = this.getConfig();
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
        if (themeLink) {
            const themeLinkHref = themeLink.getAttribute('href')!;
            const newHref = themeLinkHref
                .split('/')
                .map((el) =>
                    el == this._config.theme
                        ? (el = config.theme)
                        : el == `theme-${this._config.colorScheme}`
                            ? (el = `theme-${config.colorScheme}`)
                            : el
                )
                .join('/');

            this.replaceThemeLink(newHref);
        }
    }

    changeScale(value: number) {
        document.documentElement.style.fontSize = `${value}px`;
    }

    // }
    private onConfigUpdate() {
        this.configUpdate.next(this.getConfig());
    }

    private replaceThemeLink(href: string) {
        const id = 'theme-css';
        const themeLink = document.getElementById(id) as HTMLLinkElement;
        if (themeLink) {
            const cloneLinkElement = themeLink.cloneNode(true) as HTMLLinkElement;

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
            cloneLinkElement.addEventListener('load', () => {
                themeLink.remove();
                cloneLinkElement.setAttribute('id', id);
            });
        }
    }
}
