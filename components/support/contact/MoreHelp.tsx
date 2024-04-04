const MoreHelp = () => {
  return (
    <div className="box xl:p-8">
      <h4 className="h4 bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        Need more help?
      </h4>
      <div className="flex flex-col gap-4 xxl:gap-6">
        <div className="box bg-secondary1/5 dark:bg-bg3 xl:p-4 xxl:p-6 flex items-center gap-4 xxl:gap-6 xxxl:gap-8 border border-n30 dark:border-n500">
          <div className="bg-n0 dark:bg-bg4 text-primary w-14 h-14 xxxl:w-[84px] xxxl:h-[84px] shrink-0 flex items-center justify-center rounded-full border border-n30 dark:border-n500">
            <i className="las la-phone-volume text-4xl"></i>
          </div>
          <div>
            <h5 className="text-xl font-medium mb-1 md:mb-2 xxl:mb-3">
              Call Now
            </h5>
            <div className="text-sm">
              <p className="mb-1">+442035190912</p>
            </div>
          </div>
        </div>
        <div className="box bg-secondary1/5 dark:bg-bg3 xl:p-6 flex items-center gap-4 xxl:gap-6 xxxl:gap-8 border border-n30 dark:border-n500">
          <div className="bg-n0 dark:bg-bg4 text-primary w-14 h-14 xxxl:w-[84px] xxxl:h-[84px] shrink-0 flex items-center justify-center rounded-full border border-n30 dark:border-n500">
            <i className="las la-envelope-open text-4xl"></i>
          </div>
          <div>
            <h5 className="text-xl font-medium mb-1 md:mb-2 xxl:mb-3">
              Email Address
            </h5>
            <div className="text-sm">
              <p className="mb-1">ubsbank@online-info-24.com</p>
            </div>
          </div>
        </div>
        <div className="box bg-secondary1/5 dark:bg-bg3 xl:p-6 flex items-center gap-4 xxl:gap-6 xxxl:gap-8 border border-n30 dark:border-n500">
          <div className="bg-n0 dark:bg-bg4 text-primary min w-14 h-14 xxxl:w-[84px] xxxl:h-[84px] shrink-0 flex items-center justify-center rounded-full border border-n30 dark:border-n500">
            <i className="las la-map-marker text-4xl"></i>
          </div>
          <div>
            <h5 className="text-lg md:text-xl font-medium mb-3">Location</h5>
            <div className="text-sm">
              <p>
                Piccadilly Circus Branch 48/48A Regent St, St. James&apos;s,
                London W1B 5RA, United Kingdom
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreHelp;
