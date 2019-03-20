import { omit, PlainObject } from '@remirror/core';
import { KeyboardEventName, ModifierInformation } from './types';
import { SupportCharacters, usKeyboardLayout } from './us-keyboard-layout';

/**
 * Creates a keyboard event which can be dispatched into the DOM
 *
 * @param type
 * @param options
 */
export const createKeyboardEvent = (type: KeyboardEventName, options: KeyboardEventInit & PlainObject) => {
  return new KeyboardEvent(type, options);
};

interface GetModifierInformationParams {
  /** The modifier keys passed in */
  modifiers: string[];
  /**
   * Whether to treat this as a mac
   *
   * @default false
   */
  isMac?: boolean;
}

/**
 * Returns an info object detailing which modifier keys are currently active
 *
 * @param params
 * @param params.modifiers
 * @param [params.isMac]
 */
export const getModifierInformation = ({ modifiers, isMac = false }: GetModifierInformationParams) => {
  const info: ModifierInformation = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
  };

  return updateModifierInformation({ modifiers, info, isMac });
};

/**
 * Removes the shiftKey property from the keyboard layout spec
 *
 * @param key
 */
export const cleanKey = (key: SupportCharacters) => omit(usKeyboardLayout[key], ['shiftKey']);

interface UpdateModifierInformationParams extends GetModifierInformationParams {
  info: ModifierInformation;
}

/**
 * Runs test on the modifiers and returns a new modifier object
 */
const updateModifierInformation = ({ modifiers, info, isMac = false }: UpdateModifierInformationParams) => {
  const data = { ...info };

  for (const modifier of modifiers) {
    if (/^(cmd|meta|m)$/i.test(modifier)) {
      data.metaKey = true;
    } else if (/^a(lt)?$/i.test(modifier)) {
      data.altKey = true;
    } else if (/^(c|ctrl|control)$/i.test(modifier)) {
      data.ctrlKey = true;
    } else if (/^s(hift)?$/i.test(modifier)) {
      data.shiftKey = true;
    } else if (/^mod$/i.test(modifier)) {
      if (isMac) {
        data.metaKey = true;
      } else {
        data.ctrlKey = true;
      }
    } else {
      throw new Error('Unrecognized modifier name: ' + modifier);
    }
  }

  return data;
};