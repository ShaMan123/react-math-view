import React, { PropsWithChildren, useLayoutEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';

export default function useCustomElement<R extends HTMLElement, P extends PropsWithChildren<{}> = {}>(props: P, customMapping: Partial<{ [key in keyof P]: string }> = {}) {
    const ref = useRef<R>();
    useLayoutEffect(() => {
        const { current } = ref;

        let fns: { key: string, fn: (customEvent: any) => any }[];

        if (current) {
            fns = Object.keys(props)
                .filter(key => props[key] instanceof Function)
                .map(key => ({
                    key: customMapping[key] || key.indexOf('on') === 0 && key.slice(2).toLowerCase() || key,
                    fn: (customEvent: any) => props[key](customEvent.detail, customEvent),
                }));

            fns.forEach(({ key, fn }) => {
                current.addEventListener(key, fn);
            });
        }

        return () => {
            if (current) {
                fns.forEach(({ key, fn }) =>
                    current.removeEventListener(key, fn),
                );
            }
        };
    }, [customMapping, props, ref]);

    const customElementProps = Object.keys(props)
        .filter(key => !(props[key] instanceof Function))
        .reduce((acc, key) => {
            const prop = props[key];
            const computedKey = customMapping[key] || key;
            let value;

            if (React.isValidElement(prop) || (prop instanceof Array && prop.every(React.isValidElement))) {
                value = renderToString(prop as React.ReactElement);
            } else if (prop instanceof Object || prop instanceof Array) {
                value = JSON.stringify(prop);
            } else {
                value = prop;
            }

            return { ...acc, [computedKey]: value };
        }, {});

    return [customElementProps, ref] as [Partial<P>, React.RefObject<R>];
};