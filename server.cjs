import('./app.js').then((module) => {
    const app = module.default;

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
