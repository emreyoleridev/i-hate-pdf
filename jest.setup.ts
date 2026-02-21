import '@testing-library/jest-dom';

class IntersectionObserverMock {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    disconnect() { }
    observe() { }
    takeRecords(): IntersectionObserverEntry[] { return []; }
    unobserve() { }
}

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock
});

Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock
});
