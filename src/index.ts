class Test {
  main(): void {
    console.log('OK');
    console.log('OK');
    console.dir({ foo: 'bar' });
  }
}

new Test().main();
