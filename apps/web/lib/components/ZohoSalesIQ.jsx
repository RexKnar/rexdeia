'use client';

import React, { useEffect } from 'react';

export function ZohoSalesIQ() {
  useEffect(() => {
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {
      values: {},
      ready: function () {},
      widgetcode: process.env['NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE'],
    };

    // Load the script
    const script = document.createElement('script');
    script.defer = true;
    script.async = true;
    script.id = 'zsiqscript';
    script.src = 'https://salesiq.zohopublic.com/widget';

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="zsiqwidget"></div>;
}
