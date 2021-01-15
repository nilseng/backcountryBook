class Map3DControl implements mapboxgl.IControl {

    _map: mapboxgl.Map | undefined = undefined
    _container: HTMLElement | undefined = undefined


    onAdd(map: mapboxgl.Map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.id = '_3DControl'
        this._container.className = 'mapboxgl-ctrl btn btn-sm bg-dark text-light font-weight-bold';
        this._container.textContent = '3D';
        return this._container;
    }

    onRemove() {
        if (this._container?.parentNode) this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    on(type: string, cb: Function) {
        if (type === "click") {
            this._container?.addEventListener("click", () => {
                cb()
            });
        }
        return this;
    }
}

export default Map3DControl