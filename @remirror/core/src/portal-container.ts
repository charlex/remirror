import NanoEvents from 'nanoevents';
import { uniqueId } from './helpers/base';

export interface RenderParams {
  /**
   * Renders a JSX element.
   */
  render: () => JSX.Element;
}

export interface MountedPortal extends RenderParams {
  key: string;
}

export interface RenderMethodParams extends RenderParams {
  /**
   * The DOM element to contain the react portal.
   */
  container: HTMLElement;
}

interface Events {
  update: PortalMap;
}

export type PortalList = ReadonlyArray<[HTMLElement, MountedPortal]>;
export type PortalMap = Map<HTMLElement, MountedPortal>;

/**
 * The node view portal container keeps track of all the portals which have been added by react to render
 * the node views in the editor.
 */
export class NodeViewPortalContainer {
  public portals: Map<HTMLElement, MountedPortal> = new Map();
  public events = new NanoEvents<Events>();

  /**
   * Event handler for subscribing to update events from the portalContainer.
   */
  public on = (callback: (map: PortalMap) => void) => {
    return this.events.on('update', callback);
  };

  /**
   * Trigger an update in all subscribers.
   */
  private update(map: PortalMap) {
    this.events.emit('update', map);
  }

  /**
   * Responsible for registering a new portal by rendering the react element into the provided container.
   */
  public render({ render, container }: RenderMethodParams) {
    this.portals.set(container, { render, key: uniqueId() });
    this.update(this.portals);
  }

  /**
   * Force an update in all the portals by setting new keys for every portal which doesn't
   * have a react context.
   *
   * TODO is this even needed (currently it's never used)
   */
  public forceUpdate() {
    this.portals.forEach(({ render }, container) => {
      // Assign the portal a new key so it is re-rendered
      this.portals.set(container, { render, key: uniqueId() });
    });

    this.update(this.portals);
  }

  /**
   * Deletes the portal within the container.
   */
  public remove(container: HTMLElement) {
    this.portals.delete(container);
    this.update(this.portals);
  }
}
